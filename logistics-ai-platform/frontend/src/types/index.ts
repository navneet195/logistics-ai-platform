export interface Agent {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: "online" | "offline" | "busy";
    description: string;
    capabilities: string[];
    suggestedPrompts: string[];
}

export interface Message {
    id: string;
    content: string;
    role: "user" | "agent";
    timestamp: Date;
    agentId?: string;
}

export interface ChatSession {
    id: string;
    title: string;
    agentId: string;
    lastMessage: string;
    lastMessageTime: Date;
    unread: number;
}
