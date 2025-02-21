import React from "react";
import ResponsiveAppBar from "./ResponsiveAppBar.jsx";
import Footer from "./Footer.jsx";


const HomePage = () => {

    return (
        <>
            <ResponsiveAppBar/>
            <section>
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <h1 className="text-4xl font-semibold text-gray-800">Website Under Construction</h1>
                </div>
            </section>
            <Footer/>
        </>

    );
};

export default HomePage;
