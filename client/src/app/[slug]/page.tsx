'use client';

import { ArrowBigDown, ArrowBigUp, MessageSquare, Share2 } from 'lucide-react';

import React, { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface VoteButtonProps {
    // Fixed the icon prop type for TypeScript
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
    isActive: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({
    icon: Icon,
    onClick,
    isActive,
}) => (
    <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        className="rounded-full w-8 h-8 sm:w-10 sm:h-10 hover:bg-transparent"
    >
        <Icon
            className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors ${
                isActive
                    ? 'text-[#8F2F2F] fill-[#8F2F2F]'
                    : 'hover:text-[#8F2F2F]'
            }`}
        />
    </Button>
);

interface VoteSectionProps {
    initialVotes: number;
}

const VoteSection: React.FC<VoteSectionProps> = ({ initialVotes }) => {
    const [votes, setVotes] = useState<number>(initialVotes);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

    const handleVote = (type: 'up' | 'down') => {
        if (userVote === type) {
            setUserVote(null);
            setVotes(initialVotes);
        } else {
            setUserVote(type);
            setVotes((prevVotes) =>
                type === 'up' ? prevVotes + 1 : prevVotes - 1
            );
        }
    };

    return (
        <div className="flex flex-col items-center mr-2 sm:mr-4 mb-4 sm:mb-0">
            <VoteButton
                icon={ArrowBigUp}
                onClick={() => handleVote('up')}
                isActive={userVote === 'up'}
            />
            <span className="text-sm sm:text-base font-bold my-1 sm:my-2">
                {votes}
            </span>
            <VoteButton
                icon={ArrowBigDown}
                onClick={() => handleVote('down')}
                isActive={userVote === 'down'}
            />
        </div>
    );
};

const ThreadPage: React.FC = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white border-b">
                {/* Header content */}
            </header>
            <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col space-y-4 sm:space-y-6">
                    {/* Main content */}
                    <div className="flex-grow">
                        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                            <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
                                How can I update each dependency in package.json
                                to the latest version?
                            </h1>
                            <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
                                <span>Asked 1 year, 5 months ago</span>
                                <span className="mx-1 sm:mx-2">•</span>
                                <span>Modified 5 months ago</span>
                                <span className="mx-1 sm:mx-2">•</span>
                                <span>Viewed 1.8m times</span>
                            </div>
                        </Card>

                        {/* Question */}
                        <Card className="mb-4 sm:mb-6">
                            <CardContent className="pt-4 sm:pt-6">
                                {/* Adjusted flex classes for responsiveness */}
                                <div className="flex flex-col sm:flex-row">
                                    <VoteSection initialVotes={2838} />
                                    <div className="flex-grow">
                                        <p className="mb-2 sm:mb-4 text-sm sm:text-base">
                                            I copied package.json from another
                                            project and now want to bump all of
                                            the dependencies to their latest
                                            versions since this is a fresh
                                            project and I don't mind fixing
                                            something if it breaks.
                                        </p>
                                        <p className="mb-2 sm:mb-4 text-sm sm:text-base">
                                            What's the easiest way to do this?
                                        </p>
                                        <pre className="bg-gray-100 p-2 sm:p-4 rounded-md mt-2 sm:mt-4 text-xs sm:text-sm overflow-x-auto">
                                            {`{
  "name": "myproject",
  "description": "my node project",
  "version": "1.0.0",
  "dependencies": {
    "express": "^3.3.8", // how do I get these bumped to latest?
    "mongodb": "^1.2.3",
    "underscore": "^1.4.2"
  }
}`}
                                        </pre>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Answers */}
                        <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                            42 Answers
                        </h2>
                        <Card className="mb-4 sm:mb-6">
                            <CardContent className="pt-4 sm:pt-6">
                                {/* Adjusted flex classes for responsiveness */}
                                <div className="flex flex-col sm:flex-row">
                                    <VoteSection initialVotes={4} />
                                    <div className="flex-grow">
                                        <p className="mb-2 sm:mb-4 text-sm sm:text-base">
                                            There is an online package.json
                                            update tool. The versions can also
                                            be selected via a dropdown.
                                        </p>
                                        <p className="mb-2 sm:mb-4 text-sm sm:text-base">
                                            It also updates to the major
                                            version, which npm outdated and ncu
                                            don't do.
                                        </p>
                                        <p className="text-sm sm:text-base">
                                            Paste the package.json content into
                                            the input field and let it parse:
                                        </p>
                                        {/* Add more answer content here */}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreadPage;
