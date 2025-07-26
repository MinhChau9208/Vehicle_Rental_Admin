import Sidebar from '../components/Sidebar';
import UserRequests from '../views/UserRequests';
import VehicleRequests from '../views/VehicleRequests';
import ClaimsComplaints from '../components/ClaimsComplaints';

const AdminPanel = ({ token }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 p-6">
      <h1 className="text-3xl mb-4">Hey, Kiet!</h1>
      <button onClick={() => console.log('Access Token:', token)}>hi</button>
      <div className="grid grid-cols-3 grid-rows-1 gap-4">
        <div >1</div>
        <div >2</div>
        <div >3</div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <UserRequests token={token} />
        <VehicleRequests token={token} />
        <ClaimsComplaints />
      </div>
    </div>
  </div>
);

export default AdminPanel;