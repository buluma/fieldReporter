
document.addEventListener('DOMContentLoaded', async function() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const logsTable = document.getElementById('logsTable');
    const logsTableBody = document.getElementById('logsTableBody');
    
    try {
        // Initialize the database
        await initDB();
        
        // Get all login logs
        const logs = await getAllLoginLogs();
        
        // Clear loading message
        loadingElement.style.display = 'none';
        
        if (logs.length === 0) {
            logsTableBody.innerHTML = '<tr><td colspan="5">No login logs found.</td></tr>';
        } else {
            // Populate the table with logs
            logs.forEach(log => {
                const row = document.createElement('tr');
                
                // Format the timestamp for better readability
                const date = new Date(log.timestamp);
                const formattedDate = date.toLocaleString();
                
                row.innerHTML = `
                    <td>${log.id}</td>
                    <td>${log.username}</td>
                    <td>${log.userId}</td>
                    <td>${formattedDate}</td>
                    <td>${log.eventType}</td>
                `;
                logsTableBody.appendChild(row);
            });
        }
        
        // Show the table
        logsTable.style.display = 'table';
    } catch (error) {
        console.error('Error loading login logs:', error);
        loadingElement.style.display = 'none';
        errorElement.textContent = 'Error loading login logs: ' + error.message;
        errorElement.style.display = 'block';
    }
});
