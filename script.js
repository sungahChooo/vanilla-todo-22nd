document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todoInput");
  const addBtn = document.getElementById("addBtn");
  const todoList = document.getElementById("todoList");
  const selectedDateInput = document.getElementById("selectedDateInput");
  const countDisplay = document.getElementById("countDisplay");
  const title = document.getElementById("title"); // h1 선택

  //데이터 로드 & 초기화
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // 날짜 입력 기본값: 오늘
  selectedDateInput.value = getToday();

  // 초기 렌더링
  renderTodos(todos);

  /*투두 추가기능*/
  addBtn.addEventListener("click", () => {
    const text = todoInput.value.trim();
    const date = selectedDateInput.value;

    if (text === "" || date === "") {
      alert("할 일과 날짜를 입력하세요!");
      return;
    }

    const todo = {
      id: Date.now(),
      text,
      date,
      completed: false, // 완료 여부 추가
    };

    todos.push(todo);
    saveTodos();
    filterByDate(date);

    todoInput.value = "";
    selectedDateInput.value = date; // 날짜 유지
  });

  /* 날짜별 조회 기능 */
  selectedDateInput.addEventListener("change", () => {
    filterByDate(selectedDateInput.value);
  });

  function filterByDate(date) {
    if (!date) return;

    const filtered = todos.filter((t) => t.date === date);
    renderTodos(filtered);
    countDisplay.textContent = `${filtered.length}개`;
  }

  /* 제목 클릭시 오늘 날짜로 조회 기능 */
  title.addEventListener("click", () => {
    selectedDateInput.value = getToday(); // 날짜 오늘로 초기화
    filterByDate(selectedDateInput.value); // 조회 버튼 없이 바로 조회
  });

  /* 투두 렌더링 */
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

      // 투두 완료 체크박스
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        saveTodos();
        renderTodos(list); // 상태 업데이트 후 다시 렌더링
      });

      // 할 일 텍스트
      const span = document.createElement("span");
      span.textContent = todo.text;
      if (todo.completed) {
        span.style.textDecoration = "line-through"; // 완료시 취소선
        span.style.color = "gray";
      }

      //삭제 버튼
      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.classList.add("deleteBtn");
      delBtn.addEventListener("click", () => {
        todos = todos.filter((t) => t.id !== todo.id);
        saveTodos();
        renderTodos(todos);
      });

      // li에 요소 추가
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      todoList.appendChild(li);
    });
  }

  /* 로컬 스토리지 저장 */
  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
});

/* 오늘 날짜 반환 */
function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
