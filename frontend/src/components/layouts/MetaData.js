import { Helmet } from "react-helmet-async"

export default function MetaData({title =  'Default Title' }) {
    return (
        <Helmet>
            <title>{`${title} - online shopping`}</title>
        </Helmet>
    )
}