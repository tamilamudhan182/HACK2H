import { useAppContext } from "../context/AppContext";

function RoleToggle() {
  const { role, setRole } = useAppContext();

  return (
    <label className="role-toggle">
      <span>Workspace Role</span>
      <select value={role} onChange={(event) => setRole(event.target.value)}>
        <option value="Viewer">Viewer</option>
        <option value="Admin">Admin</option>
      </select>
    </label>
  );
}

export default RoleToggle;
