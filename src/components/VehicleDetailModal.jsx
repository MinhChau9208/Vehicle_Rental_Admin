import React, { useState } from 'react';
import Modal from './Modal'; // Assuming you have a generic Modal component

// Helper component for displaying a detail item
const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-md font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
);

// Helper component for displaying boolean features
const FeatureItem = ({ label, isAvailable }) => (
    <div className={`flex items-center p-2 rounded-md text-sm ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
        <span className="font-medium">{label}</span>
    </div>
);

const VehicleDetailModal = ({ isOpen, onClose, vehicle, onApprove, onReject }) => {
    const [rejectionReason, setRejectionReason] = useState('');

    if (!isOpen || !vehicle) return null;

    const handleReject = () => {
        if (!rejectionReason) {
            alert("Rejection reason is required.");
            return;
        }
        onReject(vehicle.id, rejectionReason);
    };

    const handleApprove = () => {
        onApprove(vehicle.id);
    };

    const allImages = [
        vehicle.imageFront, vehicle.imageEnd, vehicle.imageRearLeft, vehicle.imageRearRight,
        vehicle.imagePic1, vehicle.imagePic2, vehicle.imagePic3, vehicle.imagePic4, vehicle.imagePic5
    ].filter(Boolean);

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Vehicle Details: ${vehicle.title}`}
            // Set a max-width, but let the Modal component handle its own height and centering
            className="max-w-4xl w-full"
        >
            {/* This component's children are now wrapped in a single flex container.
              This container has a fixed height relative to the viewport (vh)
              to ensure it fits on screen.
            */}
            <div className="flex flex-col h-[80vh]">
                {/* SCROLLABLE CONTENT AREA */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Image Gallery */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-700">Vehicle Images</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {allImages.map((img, index) => (
                                <a key={index} href={img} target="_blank" rel="noopener noreferrer">
                                    <img src={img} alt={`Vehicle view ${index + 1}`} className="w-full h-32 object-cover rounded-lg shadow-md hover:opacity-80 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-bold mb-4 text-gray-700">Vehicle Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <DetailItem label="Brand" value={vehicle.brand} />
                            <DetailItem label="Model" value={vehicle.model} />
                            <DetailItem label="Year" value={vehicle.year} />
                            <DetailItem label="Color" value={vehicle.color} />
                            <DetailItem label="Type" value={vehicle.vehicleType} />
                            <DetailItem label="Seats" value={vehicle.seatingCapacity} />
                            <DetailItem label="Transmission" value={vehicle.transmission} />
                            <DetailItem label="Fuel Type" value={vehicle.fuelType} />
                            <DetailItem label="Price (per day)" value={`${vehicle.price.toLocaleString()} VND`} />
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <DetailItem label="Description" value={vehicle.description} />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-bold mb-4 text-gray-700">Features</h3>
                        <div className="flex flex-wrap gap-3">
                            <FeatureItem label="Air Conditioning" isAvailable={vehicle.airConditioning} />
                            <FeatureItem label="GPS" isAvailable={vehicle.gps} />
                            <FeatureItem label="Bluetooth" isAvailable={vehicle.bluetooth} />
                            <FeatureItem label="Dash Cam" isAvailable={vehicle.dashCamera} />
                            <FeatureItem label="Backup Cam" isAvailable={vehicle.cameraBack} />
                            <FeatureItem label="Airbags" isAvailable={vehicle.safetyAirBag} />
                            <FeatureItem label="Collision Sensors" isAvailable={vehicle.collisionSensors} />
                            <FeatureItem label="ETC" isAvailable={vehicle.ETC} />
                        </div>
                    </div>

                    {/* Registration Documents */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-bold mb-4 text-gray-700">Registration Documents</h3>
                        <DetailItem label="Registration ID" value={vehicle.vehicleRegistrationId} />
                        <div className="flex gap-4 mt-4">
                            <a href={vehicle.vehicleRegistrationFront} target="_blank" rel="noopener noreferrer"><img src={vehicle.vehicleRegistrationFront} alt="Registration Front" className="w-56 h-40 object-cover rounded-lg shadow-md hover:opacity-80 transition-opacity" /></a>
                            <a href={vehicle.vehicleRegistrationBack} target="_blank" rel="noopener noreferrer"><img src={vehicle.vehicleRegistrationBack} alt="Registration Back" className="w-56 h-40 object-cover rounded-lg shadow-md hover:opacity-80 transition-opacity" /></a>
                        </div>
                    </div>
                </div>

                {/* DECISION AREA (FOOTER) */}
                <div className="flex-shrink-0 p-4 bg-gray-100 border-t">
                    <h3 className="text-lg font-bold mb-4">Make a Decision</h3>
                    <div className="space-y-4">
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            rows="2"
                            placeholder="If rejecting, provide a clear reason here..."
                        ></textarea>
                        <div className="flex justify-end space-x-3">
                            <button onClick={handleReject} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300" disabled={!rejectionReason}>Reject</button>
                            <button onClick={handleApprove} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Approve</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default VehicleDetailModal;
