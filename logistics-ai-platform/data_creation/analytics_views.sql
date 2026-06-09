CREATE OR REPLACE VIEW customer_profitability AS
SELECT
    c.customer_id,
    c.customer_name,

    SUM(i.invoice_amount) AS revenue,

    SUM(
        s.transport_cost +
        s.fuel_cost +
        s.storage_cost
    ) AS cost,

    SUM(i.invoice_amount)
    -
    SUM(
        s.transport_cost +
        s.fuel_cost +
        s.storage_cost
    ) AS profit

FROM customers c
JOIN shipments s ON c.customer_id = s.customer_id
JOIN invoices i ON s.shipment_id = i.shipment_id
GROUP BY c.customer_id, c.customer_name;


CREATE OR REPLACE VIEW route_performance AS
SELECT
    route_id,
    COUNT(*) AS shipments,
    AVG(delay_days) AS avg_delay
FROM shipments
GROUP BY route_id;