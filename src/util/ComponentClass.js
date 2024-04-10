const tableClass = {
    table: ["border"],
    tr: ["border-t", "border-divider"],
    th: ["bg-white", "text-default-500"],
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
const inputClass = {
    label: "text-black/50",
    input: [
        "bg-transparent",
        "text-black/90",
        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
    ],
    innerWrapper: [
        "bg-transparent",
    ],
    inputWrapper: [
        "hover:bg-white",
        "border-1",
        "bg-white",
        "group-data-[focused=true]:bg-default-200/50",
        "!cursor-text",
    ],
}

module.exports = {
    tableClass,
    inputClass
}