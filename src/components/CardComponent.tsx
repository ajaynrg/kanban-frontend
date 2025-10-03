import type { ICard } from "../interfaces/card.model";

function CardComponent({cardData}: {cardData: ICard}) {
    return <div>{cardData.title}</div>;
}

export default CardComponent;