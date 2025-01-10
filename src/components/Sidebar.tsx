import React, { useEffect, useState } from "react"; 
import { TodoistApi } from "@doist/todoist-api-typescript"; 
import { Layout, Typography, List, Button, Alert, Modal, Input, Menu, Dropdown, message } from "antd"; 
import { PlusOutlined, MoreOutlined } from "@ant-design/icons"; 
import Todoist from "./Todoist"; 

const { Sider } = Layout; 
const { Text } = Typography;

const Sidebar: React.FC = () => { 
  const [projects, setProjects] = useState<{ id: string; name: string; isFavorite: boolean }[]>([]); 
  const [favorites, setFavorites] = useState<{ id: string; name: string; isFavorite: boolean }[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [newProjectName, setNewProjectName] = useState(""); 
  const [editProjectId, setEditProjectId] = useState<string | null>(null); 
  const [editProjectName, setEditProjectName] = useState(""); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null); 
  const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_TOKEN as string);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => { 
    try { 
      const allProjects = await api.getProjects(); 
      setProjects(allProjects); 
      setFavorites(allProjects.filter((project) => project.isFavorite)); 
    } catch { 
      setError("Failed to load projects. Please try again later."); 
    } 
  };

  const handleAddProject = async () => { 
    if (!newProjectName.trim()) { 
      message.warning("Project name cannot be empty."); 
      return; 
    } 
    try { 
      const newProject = await api.addProject({ name: newProjectName }); 
      setProjects([...projects, newProject]); 
      console.log()
      if (newProject.isFavorite) { 
        setFavorites([...favorites, newProject]); 
      } 
      setIsAddModalOpen(false); 
      setNewProjectName(""); 
      message.success("Project added successfully."); 
    } catch { 
      setError("Failed to add project. Please try again later."); 
    } 
  };

  const handleDeleteProject = async (id: string) => { 
    try { 
      setProjects(projects.filter((project) => project.id !== id)); 
      setFavorites(favorites.filter((project) => project.id !== id)); 
      await api.deleteProject(id); 
      message.success("Project deleted successfully."); 
    } catch { 
      setError("Failed to delete project. Please try again later."); 
    } 
  };

  const handleEditProject = async () => { 
    if (!editProjectName.trim()) { 
      message.warning("Project name cannot be empty."); 
      return; 
    } 
    try { 
      const updatedProject = await api.updateProject(editProjectId!, { name: editProjectName }); 
      //console.log(updatedProject);
      setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))); 
      setFavorites((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))); 
      setIsEditModalOpen(false); 
      setEditProjectId(null); 
      setEditProjectName(""); 
      message.success("Project updated successfully."); 
    } catch { 
      setError("Failed to update project. Please try again later."); 
    } 
  };

const toggleFavorite = async (projectId: string, isFavorite: boolean) => { 
    try { 
      const currentProject = projects.find(p => p.id === projectId);
      if (!currentProject) return;

      const updatedProject = await api.updateProject(projectId, { 
        name: currentProject.name,
        isFavorite 
      }); 
      setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))); 
      if (isFavorite) { 
        setFavorites((prev) => [...prev, updatedProject]); 
      } else { 
        setFavorites((prev) => prev.filter((p) => p.id !== updatedProject.id)); 
      } 
      message.success("Favorite status updated."); 
    } catch (error) { 
      console.error(error);
      setError("Failed to update favorite status. Please try again later."); 
    } 
  };

  const menu = (projectId: string, projectName: string, isFavorite: boolean) => (
    <Menu>
      <Menu.Item key="1" onClick={() => { setEditProjectId(projectId); setEditProjectName(projectName); setIsEditModalOpen(true); }}>Edit</Menu.Item>
      <Menu.Item key="2" onClick={() => toggleFavorite(projectId, !isFavorite)}>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</Menu.Item>
      <Menu.Item key="3" onClick={() => handleDeleteProject(projectId)}>Delete</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#f5f5f5", padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography.Title level={3}>Utkarsh</Typography.Title>
          <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)} style={{ backgroundColor: "#ff9933", borderColor: "#ff9933" }} />
        </div>
        {error && <Alert message={error} type="error" showIcon closable />}
        <Text strong style={{ marginTop: "16px", display: "block" }}>Favorites</Text>
        <List dataSource={favorites} renderItem={(project) => (
          <List.Item onClick={() => setSelectedProject({ id: project.id, name: project.name })}>
            <Text># {project.name}</Text>
            <Dropdown overlay={menu(project.id, project.name, project.isFavorite)} trigger={["click"]}>
              <MoreOutlined style={{ cursor: "pointer", marginLeft: "18px" }} />
            </Dropdown>
          </List.Item>
        )} />
        <Typography.Text strong style={{ marginTop: "16px", display: "block" }}>All Projects</Typography.Text>
        <List dataSource={projects} renderItem={(project) => (
          <List.Item onClick={() => setSelectedProject({ id: project.id, name: project.name })}>
            <Text># {project.name}</Text>
            <Dropdown overlay={menu(project.id, project.name, project.isFavorite)} trigger={["click"]}>
              <MoreOutlined  />
            </Dropdown>
          </List.Item>
        )} />
        <Modal title="Add New Project" visible={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} onOk={handleAddProject}>
          <Input placeholder="Enter project name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
        </Modal>
        <Modal title="Edit Project Name" visible={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} onOk={handleEditProject}>
          <Input placeholder="Enter new project name" value={editProjectName} onChange={(e) => setEditProjectName(e.target.value)} />
        </Modal>
      </Sider>

      <Layout style={{ padding: "16px", flex: 1, backgroundColor: "#fff" }}>
        {selectedProject && <Todoist projectId={selectedProject.id} projectName={selectedProject.name} allProjects={projects.filter((p) => p.id !== selectedProject.id)} />}
      </Layout>
    </Layout>
  );
};

export default Sidebar;