// Home.js

import React from 'react';
import CompanyStatusCounts from './CompanyStatusCounts';
import BranchCounts from './BranchCounts'; // Import the BranchCounts component

const Home = () => {
    return (
        <div className="mx-auto px-4">
            <CompanyStatusCounts />
            {/* <BranchCounts /> */}
        </div>
    );
};

export default Home;
