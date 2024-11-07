"use client";

import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Sidebar = () => {
    const creators = [
        { name: "john.duxborough", points: 229 },
        { name: "Ibrahim masud", points: 181 },
        { name: "mark.th", points: 98 },
        { name: "sy", points: 93 },
        { name: "joeledwards", points: 88 },
        { name: "christiandavis", points: 60 },
        { name: "odaabraham", points: 57 },
    ];

    return (
        <Card className="w-full md:w-[350px]">
            <CardHeader>
                <CardTitle className="text-xl">Top authors</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {creators.map((creator, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-lg font-semibold">
                                    {index + 1}
                                </span>
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-sm">
                                        {creator.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                    {creator.name}
                                </span>
                            </div>
                            <span className="text-gray-600 font-medium">
                                {creator.points} points
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Sidebar;
