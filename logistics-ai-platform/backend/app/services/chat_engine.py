from app.services.sql_executor import run_sql

def generate_sql(user_query: str):
    """
    Replace with LLM later.
    For now rule-based mapping.
    """

    if "delayed" in user_query:
        return "SELECT * FROM shipments WHERE delay_days > 0 LIMIT 50"

    if "profit" in user_query:
        return """
        SELECT customer_id, 
               SUM(transport_cost + fuel_cost + storage_cost) as cost
        FROM shipments
        GROUP BY customer_id
        LIMIT 50
        """

    return "SELECT * FROM shipments LIMIT 10"


def run_chat(query: str):
    sql = generate_sql(query)
    data = run_sql(sql)

    return {
        "sql": sql,
        "data": data.to_dict(orient="records")
    }