const todoItems = JSON.parse(localStorage.getItem('todoItems')) || []


let todoId = todoItems.length + 1

class TodoItem {
    
    constructor ({name, desc, date}) {
        this.id = todoId
        this.name = name
        this.desc = desc,
        this.date = date
        this.isFinished = false
        todoId++
    }
}

class TodoListManger {

    constructor({todoItems, todoContainer}) {
        this.todoItems = todoItems
        this.todoContainer = todoContainer
    }

    makeDate(date) {
        console.log(date);
        const dateObject = new Date(date)
        return dateObject.toDateString()
    }

    render(todoItems) {
        todoContainer.innerHTML = ''
        for (const todoItem of todoItems) {
            todoContainer.innerHTML += `
            <tr id="todoItem_${todoItem.id}">
                <th>${todoItem.id}</th>
                <td>${todoItem.name}</td>
                <td>${this.makeDate(todoItem.date)}</td>
                <td><input type="checkbox" data-todo-id="${todoItem.id}" class="todoIsFinishedCheckbox" ${todoItem.isFinished ? 'checked' : ''}></td>
                <td class="text-end">
                    <button data-todo-id="${todoItem.id}" class="btn btn-danger delete-todo-item"><i class="fa-solid fa-trash"></i></button>
                    <button data-todo-id="${todoItem.id}" class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>
                </td>
            </tr>
            `
        }
        this.launchDeleteEvent()
    }

    createTodoItem ({name, desc, date}) {
        this.todoItems.push(new TodoItem({name, desc, date}))
        localStorage.setItem('todoItems', JSON.stringify(this.todoItems))
        this.render(this.todoItems)
    }

    deleteTodoItem(todoId) {
        this.todoItems = this.todoItems.filter((item) => item.id != todoId)
        localStorage.setItem('todoItems', JSON.stringify(this.todoItems))
        this.render(this.todoItems)
    }

    launchDeleteEvent() {
        const deleteTodoItemButtons = document.querySelectorAll('.delete-todo-item')
        for (const deleteTodoItemButton of deleteTodoItemButtons) {
            deleteTodoItemButton.addEventListener('click', e => {
                const todoItemId = +deleteTodoItemButton.dataset.todoId
                this.deleteTodoItem(todoItemId)
            })
        }
    }

    searchTodoItems(value) {
        const result = this.todoItems.filter(item => item.name.includes(value) || item.desc.includes(value))
        this.render(result)
    }

}


const start = () => {
    // Start rendering...
    const todoContainer = document.querySelector('#todoContainer')
    const manager = new TodoListManger({todoItems, todoContainer})
    manager.render(todoItems)


    // Create Todo Item
    const createTodoForm = document.forms.createTodoItemForm
    createTodoForm.addEventListener('submit', e => {
        e.preventDefault()
        const createTodoItemModal = bootstrap.Modal.getInstance(document.getElementById('createTodoItemModal'))
        const name = createTodoForm.name.value
        const desc = createTodoForm.desc.value
        const date = new Date(createTodoForm.date.value)

        console.log('Created new todo item!');
        console.log(name, desc, date);

        manager.createTodoItem({name, desc, date})

        createTodoItemModal.hide()
        createTodoForm.reset()
    })

    // Delete Todo Item

    manager.launchDeleteEvent()

    // Search Todo Items
    const searchInput = document.querySelector('#search-input')
    searchInput.addEventListener('input', e => {
        console.log(e.target.value);
        const value = searchInput.value
        manager.searchTodoItems(value)
    })

}


start()