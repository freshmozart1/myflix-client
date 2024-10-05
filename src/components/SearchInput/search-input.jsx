import { useNavigate, useSearchParams } from 'react-router-dom';

export const SearchInput = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchFilter = searchParams.get('search') || '';

    const handleSearch = (event) => {
        navigate(`/?search=${event}`);
    };

    return (
        <input type="search"
            className="me-2"
            aria-label="Search"
            placeholder="Search movies"
            value={searchFilter}
            onChange={(e) => {
                e.preventDefault();
                handleSearch(e.target.value);
            }}
        />
    );
};