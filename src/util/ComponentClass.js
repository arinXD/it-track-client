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

const tableClassCondition = {
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
const SELECT_STYLE = {
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    background: 'white',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: '99%',
    backgroundPositionY: '8px',
    border: '1px solid #dfdfdf',
    paddingRight: '1.7rem'
}
const DROPDOWN_MENU_CLASS = {
    base: [
        "rounded-md",
        "text-default-500",
        "transition-opacity",
        "data-[hover=true]:text-foreground",
        "data-[hover=true]:bg-default-100",
        "dark:data-[hover=true]:bg-default-50",
        "data-[selectable=true]:focus:bg-default-50",
        "data-[pressed=true]:opacity-70",
        "data-[focus-visible=true]:ring-default-500",
    ],
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
    SELECT_STYLE,
    DROPDOWN_MENU_CLASS,
    tableClassCondition
}