import React, {FC} from "react";
import ExportedImage, { ExportedImageProps } from "next-image-export-optimizer";

export const Image: FC<ExportedImageProps> = (props) => <ExportedImage {...props} />
