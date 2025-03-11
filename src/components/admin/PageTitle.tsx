"use client";

import React from "react";

type PageTitleProps = {
    title: string;
    description?: string;
    action?: React.ReactNode;
};

export function PageTitle({ title, description, action }: PageTitleProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 py-2">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                {description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="mt-4 sm:mt-0">{action}</div>}
        </div>
    );
} 