'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import Icon from '../../assets/icon.svg';

const Header = () => {
    const router = useRouter();

    return (
        <header className="bg-white border-b p-4 flex justify-between items-center">
            <div className="flex gap-4 justify-center items-center">
                <div className="w-8 h-8">
                    <Icon />
                </div>
                <div className="text-xl">
                    <span className="text-black">intania</span>
                    <span className="text-[#872f2f] font-bold">Overflow</span>
                </div>
                <nav className="space-x-2">
                    <Button variant="ghost" size="sm">
                        ปุ่ม1
                    </Button>
                    <Button variant="ghost" size="sm">
                        ปุ่ม2
                    </Button>
                    <Button variant="ghost" size="sm">
                        ปุ่ม3
                    </Button>
                    <Button variant="ghost" size="sm">
                        ปุ่ม4
                    </Button>
                </nav>
            </div>

            <div className="space-x-2">
                <Button variant="default">สร้างเธรด</Button>
                <Button variant="outline" onClick={() => router.push('/login')}>
                    เข้าสู่ระบบ
                </Button>
            </div>
        </header>
    );
};

export default Header;
