const display = document.getElementById("display");
const themeToggle = document.getElementById("themeToggle");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let expr = "";
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

/* Render history */
function renderHistory() {
    historyList.innerHTML = "";
    history.slice().reverse().forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}
renderHistory();

/* Button clicks */
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;
        const action = btn.dataset.action;

        if (action === "clear") {
            expr = "";
            display.value = "0";
        }
        else if (action === "equals") {
            try {
                const result = eval(expr).toString();
                history.push(`${expr} = ${result}`);
                localStorage.setItem("calcHistory", JSON.stringify(history));
                renderHistory();
                expr = result;
                display.value = result;
            } catch {
                display.value = "Error";
                expr = "";
            }
        }
        else if (action === "sign") {
            expr = (parseFloat(expr) * -1).toString();
            display.value = expr;
        }
        else if (action === "percent") {
            expr = (parseFloat(expr) / 100).toString();
            display.value = expr;
        }
        else if (value) {
            expr += value;
            display.value = expr;
        }
    });
});

/* Clear history */
clearHistoryBtn.addEventListener("click", () => {
    history = [];
    localStorage.removeItem("calcHistory");
    renderHistory();
});

/* Theme toggle */
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
    themeToggle.textContent =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* Keyboard support */
document.addEventListener("keydown", (e) => {
    if ("0123456789+-*/.".includes(e.key)) {
        expr += e.key;
        display.value = expr;
    }
    if (e.key === "Enter") {
        try {
            const result = eval(expr).toString();
            history.push(`${expr} = ${result}`);
            localStorage.setItem("calcHistory", JSON.stringify(history));
            renderHistory();
            expr = result;
            display.value = result;
        } catch {
            display.value = "Error";
            expr = "";
        }
    }
    if (e.key === "Backspace") {
        expr = expr.slice(0, -1);
        display.value = expr || "0";
    }
    if (e.key === "Escape") {
        expr = "";
        display.value = "0";
    }
});
