import React from 'react'

let style = { maxWidth: '700px' }
let btn = { cursor: 'pointer' }

const List = (props) => (
    <ul className="siimple-list">
        {props.todos.map((todo, i) => {
            return <li key={i} className="siimple-list-item siimple--bg-white" style={style}><p>{todo.title}</p><hr /><p>{todo.description}</p><span style={btn} onClick={() => props.handleRemove(i)}>Delete</span></li>
        })}
    </ul>
)

export default List
