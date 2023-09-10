import React, { FC, ReactNode } from "react";

import { useTextStyles } from '@rescui/typography';
import classNames from 'classnames';

import styles from './foundation-preview.module.css';

import foundationPreviewImg from '../../../public/images/main/foundation-preview.png';
import Image from 'next/image';

interface FoundationPreviewProps {
	title: string;
	description: string;
	button: ReactNode;
	companies: {
		name: string;
		logo: ImgSrc;
	}[];
}

export const FoundationPreview: FC<FoundationPreviewProps> = ({title, description, button, companies}) => {
	const textCn = useTextStyles();

	return (
		<div className={styles.foundationPreview}>
			<Image
				src={foundationPreviewImg}
				width={434}
				height={320}
				alt=""
				className={styles.foundationPreviewImage}
			/>

			<h2 className={classNames(textCn('rs-h2'), styles.title)}>{title}</h2>

			<div className={classNames(textCn('rs-text-2'), styles.description)}>{description}</div>

			<div className={styles.secondBlock}>
				<div className={styles.companies}>
					{companies.map(company => (
						<img src={company.logo.src} alt={`${company.name} logo`} className={styles.companyLogo} key={company.name} />
					))}
				</div>
				<div className={styles.buttonWrap}>
					{button}
				</div>
			</div>
		</div>
	);
}