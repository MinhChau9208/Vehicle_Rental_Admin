import React from 'react';

/**
 * @param {object} props
 * @param {string} props.title
 * @returns {JSX.Element}
 */
const PlaceholderView = ({ title }) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-700">Feature In Development</h2>
            <p className="text-gray-500 mt-2">This section is not yet implemented but will be available in a future update.</p>
        </div>
    </div>
);

export default PlaceholderView;