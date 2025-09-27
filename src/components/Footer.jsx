import React from "react"

function Footer() {

    const year = new Date().getFullYear()

    return (
        <footer>
            <p>{year} Mathieu Delehaye</p>
        </footer>
    )

}

export default Footer 