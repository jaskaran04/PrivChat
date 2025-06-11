// Handles LLM prompt sending and UI updates
let chatHistories = {1: {}, 2: {}};
let currentChat = 1;

function switchChat(num) {
  // Save current chat state
  chatHistories[currentChat] = {
    input: document.getElementById("userInput").value,
    example: document.querySelector(".chat-example").innerHTML,
    output: document.getElementById("outputBox").innerText,
    entities: document.getElementById("piiBox") ? document.getElementById("piiBox").innerHTML : ""
  };
  // Switch active button
  document.getElementById("chatBtn1").classList.remove("active");
  document.getElementById("chatBtn2").classList.remove("active");
  document.getElementById("chatBtn" + num).classList.add("active");
  currentChat = num;
  // Restore chat state
  const hist = chatHistories[num];
  document.getElementById("userInput").value = hist.input || "";
  document.querySelector(".chat-example").innerHTML = hist.example || "";
  document.getElementById("outputBox").innerText = hist.output || "";
  if (document.getElementById("piiBox")) {
    document.getElementById("piiBox").innerHTML = hist.entities || "";
  }
}

function highlightEntities(text, entities) {
  if (!entities || entities.length === 0) return text;
  let result = '';
  let lastIdx = 0;
  // Sort entities by start index
  entities.sort((a, b) => a.start - b.start);
  entities.forEach(ent => {
    // Add text before the entity
    result += text.slice(lastIdx, ent.start);
    // Choose highlight class
    let cls = ent.label === 'PERSON' ? 'pii-highlight-orange' : 'pii-highlight-blue';
    result += `<span class="${cls}">${text.slice(ent.start, ent.end)}</span>`;
    lastIdx = ent.end;
  });
  // Add remaining text
  result += text.slice(lastIdx);
  return result;
}

function renderPIIBox(entities) {
  if (!entities || entities.length === 0) {
    document.getElementById("piiBox").innerHTML = "";
    return;
  }
  let html = "<div class='pii-box-title'>Detected PIIs:</div><ul>";
  entities.forEach(ent => {
    html += `<li><span class='pii-entity-label'>${ent.text}</span> <span class='pii-entity-type'>(${ent.label})</span></li>`;
  });
  html += "</ul>";
  document.getElementById("piiBox").innerHTML = html;
}

async function sendRequest() {
  const input = document.getElementById("userInput").value;
  if (!input.trim()) return;

  const response = await fetch("/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: input }),
  });

  const data = await response.json();

  // Highlight entities in the input and show in .chat-example
  const highlighted = highlightEntities(input, data.entities || []);
  document.querySelector(".chat-example").innerHTML = highlighted;

  // Show LLM output
  const outputBox = document.getElementById("outputBox");
  outputBox.innerText = data.llm_response;
  outputBox.classList.remove("collapsed");
  document.getElementById("toggleBtn").style.display = "inline-block";

  // Show detected PIIs
  renderPIIBox(data.entities || []);

  // Update chat state
  chatHistories[currentChat] = {
    input: input,
    example: highlighted,
    output: data.llm_response,
    entities: document.getElementById("piiBox") ? document.getElementById("piiBox").innerHTML : ""
  };
}

function toggleOutput() {
  const outputBox = document.getElementById("outputBox");
  outputBox.classList.toggle("collapsed");
  const button = document.getElementById("toggleBtn");
  button.textContent = outputBox.classList.contains("collapsed") ? "Show More" : "Show Less";
}
