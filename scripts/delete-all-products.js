// Script to delete all products
// Copy and paste this into the browser console while on the admin page

async function deleteAllProducts() {
    try {
        const response = await fetch('/api/admin/products/delete-all', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log('Delete result:', result);

        if (response.ok) {
            alert(`Success: ${result.message}`);
            // Refresh the page to show the changes
            window.location.reload();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

// Call the function
deleteAllProducts(); 