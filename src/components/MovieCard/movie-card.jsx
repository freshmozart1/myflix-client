export const MovieCard = ({movie, onClick}) => {
    return <div onClick={() => {onClick(movie)}}>{movie.title}</div>;
};