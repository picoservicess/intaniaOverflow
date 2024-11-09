"use client";

import React from "react";

import PostList from "./_components/home/postList";
import Sidebar from "./_components/home/sideBar";
import Header from "./_components/layout/header";

const Home = () => {
	return (
		<div className="bg-gray-50 min-h-screen">
			<Header />
			<div className="max-w-6xl mx-auto mt-8 px-4 flex flex-col md:flex-row gap-4 justify-center">
				<div className="flex">
					<PostList />
				</div>
				<div className="flex justify-center items-center">
					<Sidebar />
				</div>
			</div>
		</div>
	);
};

export default Home;
