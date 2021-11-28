import { library } from "@fortawesome/fontawesome-svg-core";
import { faChessBishop, faChessKing, faChessKnight, faChessPawn, faChessQueen, faChessRook } from "@fortawesome/free-solid-svg-icons";

export default Icons = () => {
    return library.add( faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessPawn );
}
