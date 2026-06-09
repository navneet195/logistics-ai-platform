export default function SQLCard({ sql, data }) {
    return (
        <div className="sql-card">
            <div className="sql-query">
                <code>{sql}</code>
            </div>

            <table>
                <thead>
                    <tr>
                        {data?.length > 0 &&
                            Object.keys(data[0]).map((k) => (
                                <th key={k}>{k}</th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((row, i) => (
                        <tr key={i}>
                            {Object.values(row).map((v, j) => (
                                <td key={j}>{v}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}