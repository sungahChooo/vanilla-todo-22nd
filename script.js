document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todoInput");
  const addBtn = document.getElementById("addBtn");
  const todoList = document.getElementById("todoList");
  const selectedDateInput = document.getElementById("selectedDateInput"); // 날짜 입력 (추가+조회 겸용)
  const resetBtn = document.getElementById("resetBtn");
  const countDisplay = document.getElementById("countDisplay");

  // localStorage에서 불러오기
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // 날짜 입력 기본값: 오늘
  filterDateInput.value = getToday();

  // 초기 렌더링
  renderTodos(todos);

  // 추가
  addBtn.addEventListener("click", () => {
    const text = todoInput.value.trim();
    const date = filterDateInput.value;

    if (text === "" || date === "") {
      alert("할 일과 날짜를 입력하세요!");
      return;
    }

    const todo = { id: Date.now(), text, date };
    todos.push(todo);
    saveTodos();
    filterByDate(date);

    todoInput.value = "";
    filterDateInput.value = date; // 날짜 유지
  });
  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  // 조회
  filterDateInput.addEventListener("change", () => {
    filterByDate(filterDateInput.value);
  });

  function filterByDate(date) {
    if (!date) return;

    const filtered = todos.filter((t) => t.date === date);
    renderTodos(filtered);
    countDisplay.textContent = `${filtered.length}개`;
  }

  const title = document.getElementById("title"); // h1 선택
  title.addEventListener("click", () => {
    filterDateInput.value = getToday(); // 날짜 오늘로 초기화
    filterByDate(filterDateInput.value); // 조회 버튼 없이 바로 조회
  });
  // 전체보기
  resetBtn.addEventListener("click", () => {
    renderTodos(todos);
    countDisplay.textContent = "";
  });

  // 렌더링 함수
  function renderTodos(list) {
    todoList.innerHTML = "";

    if (!list || list.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "표시할 할 일이 없습니다.";
      empty.style.listStyle = "none";
      todoList.appendChild(empty);
      return;
    }

    list.forEach((todo) => {
      const li = document.createElement("li");
      li.dataset.id = todo.id;

      const span = document.createElement("span");
      span.textContent = `${todo.text}`;

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.classList.add("deleteBtn");

      delBtn.addEventListener("click", () => {
        todos = todos.filter((t) => t.id !== todo.id);
        saveTodos();
        renderTodos(todos);
      });

      li.appendChild(span);
      li.appendChild(delBtn);
      todoList.appendChild(li);
    });
  }

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
});

// 오늘 날짜 YYYY-MM-DD 반환
function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
