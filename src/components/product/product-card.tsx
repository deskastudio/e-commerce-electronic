import Image from "next/image";
import { Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  title: string;
  price: string;
  oldPrice?: string;
  image: string;
  discount?: number;
  rating: number;
  reviews: number;
  hasAddToCart?: boolean;
}

export const ProductCard = ({ 
  title, 
  price, 
  oldPrice, 
  image, 
  discount, 
  rating, 
  reviews,
  hasAddToCart = false
}: ProductCardProps) => {
  return (
    <Card className="relative rounded-none border-0 group">
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        {discount && (
          <Badge className="absolute left-3 top-3 z-10 bg-red-500 hover:bg-red-500">-{discount}%</Badge>
        )}
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-contain p-4" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {hasAddToCart ? (
            <Button className="bg-white text-black hover:bg-white hover:text-black w-full mx-4 rounded-md">
              Add To Cart
            </Button>
          ) : (
            <>
              <Button size="icon" variant="secondary" className="rounded-full">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full">
                <Heart className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <CardContent className="p-0 pt-4">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-red-500 font-semibold">${price}</span>
          {oldPrice && <span className="text-gray-500 line-through">${oldPrice}</span>}
        </div>
        <div className="flex items-center mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} width="16" height="16" viewBox="0 0 16 16" fill={star <= Math.floor(rating) ? "#FFAD33" : "none"} xmlns="http://www.w3.org/2000/svg">
                <path d="M8.12111 1.28568C8.04262 1.13341 7.95755 1 7.5 1C7.04245 1 6.95738 1.13341 6.87889 1.28568L5.27466 4.50386C5.24009 4.57382 5.16387 4.61973 5.08089 4.62087L1.53905 4.73914C1.37711 4.74501 1.23636 4.84367 1.16329 4.99061C1.09021 5.13756 1.09863 5.31381 1.18396 5.45283L3.89882 9.39348C3.95251 9.4654 3.97277 9.55456 3.95394 9.6393L2.99238 13.0863C2.95376 13.2458 2.99557 13.4152 3.1015 13.5347C3.20743 13.6542 3.36447 13.7067 3.5187 13.6737L6.77741 12.6033C6.85545 12.5768 6.94124 12.5768 7.01928 12.6033L10.278 13.6737C10.4321 13.7067 10.5892 13.6542 10.6952 13.5347C10.8011 13.4152 10.8429 13.2458 10.8043 13.0863L9.84276 9.6393C9.82393 9.55456 9.84419 9.4654 9.89788 9.39348L12.6127 5.45283C12.6981 5.31381 12.7065 5.13756 12.6334 4.99061C12.5603 4.84367 12.4196 4.74501 12.2577 4.73914L8.71581 4.62087C8.63283 4.61973 8.55661 4.57382 8.52204 4.50386L8.12111 1.28568Z" stroke="#FFAD33"/>
              </svg>
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-2">({reviews})</span>
        </div>
      </CardContent>
    </Card>
  );
};