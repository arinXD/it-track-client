const tableClass = {
    table: ["border"],
    tr: ["border-t", "border-divider"],
    th: ["bg-transparent", "text-default-500"],
    td: [
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
        "mb-4",
    ],
}


module.exports = {
    tableClass
}