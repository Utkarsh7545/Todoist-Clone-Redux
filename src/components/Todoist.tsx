import React, { useEffect, useState } from "react";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { List, Button, message, Input, Checkbox, Dropdown, Menu } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SwapOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';
import { addTask, removeTask, updateTask } from '../redux/actions/taskActions';
import { RootState } from '../redux/reducers';

interface TodoistProps {
  projectId: string;
  projectName: string;
  allProjects: { id: string; name: string; isFavorite: boolean }[];
}

const Todoist: React.FC<TodoistProps> = ({ projectId, projectName, allProjects }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.task.tasks.filter(task => task.projectId === projectId));
  
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<{ id: string; content: string; description: string } | null>(null);

  const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_TOKEN as string);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const projectTasks = await api.getTasks({ projectId: projectId });
      projectTasks.forEach(task => {
        dispatch(addTask(task));
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again later.");
    }
  };

  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      message.warning("Task name cannot be empty.");
      return;
    }
    try {
      const newTask = await api.addTask({
        content: newTaskName,
        description: newTaskDescription,
        projectId: projectId,
      });
      dispatch(addTask(newTask));
      setNewTaskName("");
      setNewTaskDescription("");
      setIsAddTaskVisible(false);
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again later.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      dispatch(removeTask(taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again later.");
    }
  };

  const handleEditClick = (task: any) => {
    setEditingTask({
      id: task.id,
      content: task.content,
      description: task.description || "",
    });
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    if (!editingTask.content.trim()) {
      message.warning("Task name cannot be empty.");
      return;
    }

    try {
      await api.updateTask(editingTask.id, {
        content: editingTask.content,
        description: editingTask.description,
      });
      dispatch(updateTask({ ...editingTask, projectId }));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again later.");
    }
  };

  const handleMoveTask = async (taskId: string, targetProjectId: string) => {
    try {
      const taskToMove = tasks.find(task => task.id === taskId);
      if (!taskToMove) return;

      await Promise.all([
        api.addTask({
          content: taskToMove.content,
          description: taskToMove.description || '',
          projectId: targetProjectId
        }),
        api.deleteTask(taskId)
      ]);

      dispatch(removeTask(taskId));
    } catch (error) {
      console.error("Error moving task:", error);
      setError("Failed to move task. Please try again later.");
    }
  };

  const moveMenu = (taskId: string) => (
    <Menu>
      {allProjects.map((project) => (
        <Menu.Item key={project.id} onClick={() => handleMoveTask(taskId, project.id)}>
          {project.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div style={{ marginLeft: '80px', width: '700px' }}>
      <h2>{projectName}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
  
      <List
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Checkbox checked={task.isCompleted} onChange={() => handleDeleteTask(task.id)} style={{ marginRight: '12px' }} />
                {editingTask?.id === task.id ? (
                  <div style={{ flex: 1 }}>
                    <Input value={editingTask!.content} onChange={(e) => setEditingTask({ ...editingTask!, content: e.target.value })} style={{ marginBottom: '8px' }} />
                    <Input.TextArea value={editingTask!.description} onChange={(e) => setEditingTask({ ...editingTask!, description: e.target.value })} style={{ marginBottom: '8px' }} />
                    <Button type="primary" onClick={handleUpdateTask}>Update Task</Button>
                  </div>
                ) : (
                  <>
                    <span style={{ flex: 1, color: 'black', fontWeight: 'normal' }}>{task.content}</span>
                    <EditOutlined onClick={() => handleEditClick(task)} style={{ cursor: 'pointer', marginLeft: '8px', color: 'grey', fontSize: '18px' }} />
                    <Dropdown overlay={moveMenu(task.id)} trigger={['click']}><SwapOutlined style={{ cursor: 'pointer', marginLeft: '8px', color: 'grey', fontSize: '18px' }} /></Dropdown>
                    <DeleteOutlined onClick={() => handleDeleteTask(task.id)} style={{ cursor: 'pointer', marginLeft: '8px', color: 'grey', fontSize: '18px' }} />
                  </>
                )}
              </div>
              {!editingTask && task.description && (
                <div style={{ paddingLeft: '28px', marginTop: '4px' }}>
                  <p style={{ color: 'grey', margin: 0 }}>{task.description}</p>
                </div>
              )}
            </div>
          </List.Item>
        )}
        locale={{
          emptyText: (
            <div style={{ textAlign: 'center' }}>
              <img src="https://img.freepik.com/premium-vector/vector-person-painting_844724-17899.jpg?w=360" alt="No tasks" style={{ width: '150px', marginBottom: '16px' }} />
              <h3>Start small (or dream big ...)</h3>
              <p style={{ color: 'grey' }}>Add a task or find a template to start with your project</p>
            </div>
          )
        }}
      />
  
      <Button type="text" icon={<PlusOutlined style={{ color: '#ff9933' }} />} onClick={() => setIsAddTaskVisible(!isAddTaskVisible)} style={{ marginBottom: '16px' }} />
  
      {isAddTaskVisible && (
        <div>
          <Input placeholder="Enter task name" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} style={{ marginBottom: '8px' }} />
          <Input.TextArea placeholder="Enter task description" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} />
          <Button type="text" icon={<PlusOutlined style={{ color: '#ff9933' }} />} onClick={handleAddTask}>Add Task</Button>
        </div>
      )}
    </div>
  );
};

export default Todoist;
