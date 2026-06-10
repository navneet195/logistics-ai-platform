import { Agent, ChatSession, Message } from "@/types";

export const agents: Agent[] = [
    {
        id: "logistics-ai",
        name: "Logistics AI",
        role: "Supply Chain Intelligence",
        avatar: "🚛",
        status: "online",
        description:
            "An advanced AI assistant specialized in logistics analytics, shipment tracking, route optimization, and supply chain forecasting. Powered by natural language query processing to turn your questions into actionable insights.",
        capabilities: [
            "Natural language shipment queries",
            "SQL generation & execution",
            "Route optimization analysis",
            "Delivery performance tracking",
            "Invoice & claims processing",
            "Predictive delay estimation",
            "Carrier performance benchmarking",
            "Cost analytics & reporting",
        ],
        suggestedPrompts: [
            "Show me all delayed shipments this week",
            "What's the average delivery time for carrier FedEx?",
            "List top 5 routes by shipping cost",
            "Which warehouses have the highest claim rates?",
            "Compare carrier performance for Q2 2026",
            "Show shipments pending customs clearance",
        ],
    },
    {
        id: "data-analyst",
        name: "Data Analyst",
        role: "Business Intelligence",
        avatar: "📊",
        status: "online",
        description:
            "A data-focused AI that helps visualize trends, generate reports, and uncover insights from your logistics data warehouse.",
        capabilities: [
            "Dashboard generation",
            "Trend analysis",
            "KPI monitoring",
            "Custom report building",
            "Data visualization",
            "Anomaly detection",
        ],
        suggestedPrompts: [
            "Generate a monthly shipment volume report",
            "Show delivery success rate trends",
            "What are the top cost drivers this quarter?",
            "Create a carrier comparison dashboard",
        ],
    },
    {
        id: "ops-assistant",
        name: "Ops Assistant",
        role: "Operations Support",
        avatar: "⚙️",
        status: "busy",
        description:
            "Helps operations teams manage day-to-day logistics tasks, escalations, and workflow automation.",
        capabilities: [
            "Task automation",
            "Escalation management",
            "SLA monitoring",
            "Workflow orchestration",
            "Team notifications",
            "Process optimization",
        ],
        suggestedPrompts: [
            "Show overdue tasks assigned to my team",
            "Escalate shipment #4521 to operations manager",
            "What SLAs are at risk today?",
            "Automate daily delivery status reports",
        ],
    },
];

export const mockChatSessions: ChatSession[] = [
    {
        id: "chat-1",
        title: "Delayed Shipments Analysis",
        agentId: "logistics-ai",
        lastMessage: "Found 23 delayed shipments across 4 carriers.",
        lastMessageTime: new Date(Date.now() - 5 * 60000),
        unread: 0,
    },
    {
        id: "chat-2",
        title: "Q2 Carrier Benchmarks",
        agentId: "logistics-ai",
        lastMessage: "FedEx leads with 97.3% on-time delivery rate.",
        lastMessageTime: new Date(Date.now() - 45 * 60000),
        unread: 2,
    },
    {
        id: "chat-3",
        title: "Route Cost Optimization",
        agentId: "data-analyst",
        lastMessage: "I've identified 3 routes with potential 15% savings.",
        lastMessageTime: new Date(Date.now() - 3 * 3600000),
        unread: 0,
    },
    {
        id: "chat-4",
        title: "Warehouse Claims Report",
        agentId: "logistics-ai",
        lastMessage: "Dallas warehouse has the highest claim rate at 4.2%.",
        lastMessageTime: new Date(Date.now() - 24 * 3600000),
        unread: 0,
    },
    {
        id: "chat-5",
        title: "SLA Risk Assessment",
        agentId: "ops-assistant",
        lastMessage: "3 shipments are at risk of missing SLA deadlines.",
        lastMessageTime: new Date(Date.now() - 2 * 24 * 3600000),
        unread: 1,
    },
];

export const mockMessages: Message[] = [
    {
        id: "msg-1",
        content: "Show me all delayed shipments this week",
        role: "user",
        timestamp: new Date(Date.now() - 10 * 60000),
    },
    {
        id: "msg-2",
        content:
            "I found **23 delayed shipments** across 4 carriers this week. Here's a breakdown:\n\n| Carrier | Delayed | Avg Delay |\n|---------|---------|----------|\n| FedEx | 5 | 1.2 days |\n| UPS | 8 | 2.1 days |\n| DHL | 6 | 1.8 days |\n| USPS | 4 | 3.0 days |\n\nThe primary causes are weather disruptions (43%) and customs clearance bottlenecks (31%). Would you like me to drill down into any specific carrier?",
        role: "agent",
        timestamp: new Date(Date.now() - 9 * 60000),
        agentId: "logistics-ai",
    },
    {
        id: "msg-3",
        content: "Yes, show me UPS delays in detail",
        role: "user",
        timestamp: new Date(Date.now() - 7 * 60000),
    },
    {
        id: "msg-4",
        content:
            "Here are the **8 UPS delayed shipments** with details:\n\n1. **SHP-4521** → Dallas → Chicago — *2.5 days delayed* (Weather)\n2. **SHP-4533** → LA → NYC — *1.8 days delayed* (Volume surge)\n3. **SHP-4547** → Miami → Atlanta — *3.2 days delayed* (Customs)\n4. **SHP-4558** → Seattle → Denver — *1.1 days delayed* (Sorting error)\n5. **SHP-4562** → Boston → Houston — *2.8 days delayed* (Weather)\n6. **SHP-4571** → Phoenix → Portland — *1.5 days delayed* (Volume surge)\n7. **SHP-4580** → Detroit → Memphis — *2.2 days delayed* (Customs)\n8. **SHP-4589** → San Diego → Vegas — *1.9 days delayed* (Routing issue)\n\nTotal impact: estimated **$12,400** in penalty fees. Shall I generate an escalation report?",
        role: "agent",
        timestamp: new Date(Date.now() - 6 * 60000),
        agentId: "logistics-ai",
    },
    {
        id: "msg-5",
        content: "What's the average delivery time for all carriers?",
        role: "user",
        timestamp: new Date(Date.now() - 3 * 60000),
    },
    {
        id: "msg-6",
        content:
            "Here's the **average delivery time** analysis across all active carriers:\n\n📦 **FedEx**: 2.3 days (⬇️ 0.2 from last month)\n📦 **UPS**: 2.8 days (⬆️ 0.4 from last month)\n📦 **DHL**: 3.1 days (➡️ no change)\n📦 **USPS**: 4.2 days (⬆️ 0.8 from last month)\n\n**Overall fleet average: 3.1 days**\n\nFedEx continues to lead in speed, while USPS shows a concerning upward trend. I recommend reviewing USPS allocations for time-sensitive shipments.",
        role: "agent",
        timestamp: new Date(Date.now() - 2 * 60000),
        agentId: "logistics-ai",
    },
];

const agentResponses: Record<string, string[]> = {
    "logistics-ai": [
        "I've analyzed your logistics data and found some interesting patterns. Based on the current shipment volume, I recommend optimizing the Dallas-Chicago corridor for a potential **12% cost reduction**.\n\nWould you like me to generate a detailed optimization report?",
        "Looking at your shipment data, I can see that **97.3%** of FedEx deliveries arrived on time this month, compared to **91.2%** for UPS.\n\nThe gap is primarily driven by weather-related delays on the East Coast routes. Here's what I recommend:\n\n1. Shift time-sensitive East Coast shipments to FedEx\n2. Negotiate better SLAs with UPS for weather contingencies\n3. Consider alternative routing through Atlanta hub",
        "I've run the query against your database. Here are the results:\n\n```sql\nSELECT carrier, COUNT(*) as total, \n  AVG(delivery_days) as avg_days\nFROM shipments \nWHERE status = 'delivered' \n  AND created_at >= '2026-06-01'\nGROUP BY carrier\nORDER BY avg_days ASC;\n```\n\n**Results**: 1,247 shipments processed across 4 carriers with an overall average of 2.8 days delivery time.",
        "Based on predictive analysis, I estimate **15 shipments** are at risk of delay in the next 48 hours:\n\n- 🔴 **High Risk** (5): Weather alerts on Midwest corridors\n- 🟡 **Medium Risk** (7): Volume surge at LAX distribution center\n- 🟢 **Low Risk** (3): Minor customs processing delays\n\nShall I set up automated alerts for these shipments?",
    ],
    "data-analyst": [
        "I've compiled the monthly report. Key highlights:\n\n📈 **Shipment Volume**: Up 18% MoM\n💰 **Total Shipping Cost**: $2.4M (+5.2% MoM)\n⏱️ **Avg Delivery Time**: 2.9 days (-0.3 days)\n✅ **On-Time Rate**: 94.7% (+1.2%)\n\nThe cost increase is primarily driven by fuel surcharges. I recommend reviewing your carrier contracts before Q3.",
        "The anomaly detection system flagged 3 unusual patterns:\n\n1. **Spike in returns** from the Phoenix warehouse (3x normal rate)\n2. **Unusual routing** pattern on shipments from vendor V-2847\n3. **Cost outlier**: Invoice #INV-8832 is 4.7σ above average\n\nWould you like me to investigate any of these?",
    ],
    "ops-assistant": [
        "Here's your daily operations summary:\n\n✅ **142 shipments** dispatched today\n⏳ **28 shipments** pending pickup\n⚠️ **7 escalations** requiring attention\n🔄 **3 SLAs** at risk of breach\n\nI've auto-assigned the escalations to available team members. The SLA risks need your immediate review.",
        "I've set up the automated workflow:\n\n1. **Trigger**: Shipment delay > 24 hours\n2. **Action**: Notify operations lead + customer\n3. **Escalation**: If no response in 2 hours, escalate to manager\n4. **Report**: Daily summary at 6:00 PM EST\n\nThe workflow is now active. You can modify settings anytime.",
    ],
};

export function getAgentResponse(agentId: string): string {
    const responses = agentResponses[agentId] || agentResponses["logistics-ai"];
    return responses[Math.floor(Math.random() * responses.length)];
}
