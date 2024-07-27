const tableClass = {
    table: ["border", "table-auto", "w-full"],
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

const minimalTableClass = {
    th: ["bg-[#F6F6F6]", "text-black", "last:text-center"],
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
        "shadow-none"
    ],
}

const thinInputClass = {
    label: "text-black/50",
    input: [
        "ms-1.5",
        "!pr-0",
        "bg-transparent",
        "text-black/90",
        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
    ],
    innerWrapper: [
        "bg-transparent",
    ],
    inputWrapper: [
        "h-[32px]",
        "hover:bg-white",
        "border-1",
        "bg-white",
        "group-data-[focused=true]:bg-default-200/50",
        "!cursor-text",
        "shadow-none",
    ],
}

const insertColor = {
    bg: "bg-[#edf8f7]",
    font: "text-[#46bcaa]",
    color: "bg-[#edf8f7] text-[#46bcaa]",
    onlyColor: "#46bcaa"
}

const restoreColor = {
    bg: "bg-[#edf0ff]",
    font: "text-[#4d69fa]",
    color: "bg-[#edf0ff] text-[#4d69fa]",
    onlyColor: "#4d69fa"
}

const warningColor = {
    onlyColor: "#fff5dc",
    border: "#ffcf52"
}

const bgGrayColor = {
    bg: "#F5F5F5"
}

const deleteColor = {
    color: "bg-red-400"
}

module.exports = {
    tableClass,
    inputClass,
    restoreColor,
    insertColor,
    minimalTableClass,
    thinInputClass,
    deleteColor,
    warningColor,
    bgGrayColor,
}