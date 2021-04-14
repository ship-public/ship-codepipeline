class PropertyNotFoundError extends Error {
    constructor(propertyName) {
        super(`No property ${propertyName}`)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PropertyNotFoundError)
        }

        this.name = 'PropertyNotFoundError'
    }
}

function safeGet(object, path, { nullOnNotFound = false, nullOnNotFoundOrEmpty = false } = {}) {
    if (path.length === 0)
        return object.length === 0 && nullOnNotFoundOrEmpty ? null : object

    const nextProperty = path[0]

    if (!Object.prototype.hasOwnProperty.call(object, nextProperty))
        if (nullOnNotFound || nullOnNotFoundOrEmpty)
            return null
        else
            throw new PropertyNotFoundError(nextProperty)

    return safeGet(object[nextProperty], path.slice(1), { nullOnNotFound, nullOnNotFoundOrEmpty })
}

function safeGetAll(object, paths, { nullOnNotFound = false, nullOnNotFoundOrEmpty = false } = {}) {
    return Object.fromEntries(paths.map(path =>
        [path[path.length - 1], safeGet(object, path, { nullOnNotFound, nullOnNotFoundOrEmpty })]
    ))
}

exports.safeGet = safeGet
exports.safeGetAll = safeGetAll
