const clientsStatusOptions = [
    { label: 'Active', value: 1, color: 'success' },
    { label: 'inActive', value: 0, color: 'danger' },
]

const roomsSizeOptions = [
    { label: 'Small', value: 1 },
    { label: 'Medium', value: 2 },
    { label: 'Large', value: 3 },
    { label: 'Extra Large', value: 4 },
]

const roomsStatusOptions = [
    { label: 'Available', value: 0, color: 'success' },
    { label: 'Occupied', value: 1, color: 'danger' },
    { label: 'Maintenance', value: 2, color: 'warning' },
]

const bookingStatusOptions = [
    { label: 'Active', value: 1, color: 'success' },
    { label: 'Overdue', value: 2, color: 'danger' },
    { label: 'Evacuated', value: 3, color: 'warning' },
    { label: 'Cancelled', value: 4, color: 'danger' },
]

const invoicesStatus = [
    { label: 'Pending', value: 0, color: 'warning' }, // pay button will exist 
    { label: 'Paid', value: 1, color: 'success' }, // pay button will Not exist
    { label: 'Overdue', value: 2, color: 'danger' }, // pay button will exist
    { label: 'Cancelled', value: 3, color: 'danger' }, // pay button will Not exist
]


const paymentMethodsEnums = [
    {
        label: "Cash",
        value: 1,
    },
]

const routePermissions = {
    // Bookings Routes Permissions
    bookingList: [],
    bookingAdd: [],
    bookingEdit: [],

    // Clients Routes Permissions
    clientList: [],
    clientAdd: [],
    clientEdit: [],

    // Invoices Routes Permissions
    invoiceList: [],
    invoiceShowDetails: [],
    
    // Roles Routes Permissions
    roleList: [],
    roleAdd: [],
    roleEdit: [],
    
    // Rooms Routes Permissions
    roomList: [],
    roomAdd: [],
    roomEdit: [],
    
    // Users Routes Permissions
    userList: [],
    userAdd: [],
    userEdit: [],
}

export {
    clientsStatusOptions,
    roomsSizeOptions,
    roomsStatusOptions,
    bookingStatusOptions,
    invoicesStatus,
    routePermissions,
    paymentMethodsEnums,
}