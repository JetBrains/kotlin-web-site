import React, { useState } from 'react';
import { useCardCn, cardImageCn } from '@rescui/card';
import { Switcher } from '@rescui/switcher';
import { presets, Tag } from '@rescui/tag';
import { useTextStyles } from '@rescui/typography';
import { useTheme } from '@rescui/ui-contexts';
import type { ContentNode, GalleryCard, GalleryView } from '../../utils/cms/content';

type GalleryNode = Extract<ContentNode, { kind: 'gallery' }>;

function linkProps(card: GalleryCard) {
    return card.external ? { target: '_blank', rel: 'noreferrer' } : {};
}

function Card({ card, view }: { card: GalleryCard; view: GalleryView }) {
    const cardCn = useCardCn();
    const textCn = useTextStyles();
    const theme = useTheme();
    const tagPreset = theme === 'dark' ? presets['filled-dark'] : presets['filled-light'];
    const className = `nw-card ${cardCn({ isClickable: Boolean(card.href) })}`;
    const content = (
        <>
            {card.image ? (
                <span className={`nw-card-image ${cardImageCn({ cardImageType: 'cardImageImg' })}`}>
                    <img src={card.image.src} alt={card.image.alt} style={{ objectFit: view.imageFit }} />
                </span>
            ) : (
                view.preview && <span className="nw-card-image nw-card-image-empty" aria-hidden="true" />
            )}
            {card.eyebrow && (
                <div className={`nw-card-eyebrow ${textCn('rs-text-3', { hardness: 'hard' })}`}>{card.eyebrow}</div>
            )}
            {card.title && <h3 className={`nw-card-title ${textCn('rs-h4')}`}>{card.title}</h3>}
            {card.relations.length > 0 && (
                <div className={`nw-card-relations ${textCn('rs-text-3')}`}>{card.relations.join(' · ')}</div>
            )}
            {card.meta.length > 0 && (
                <div className={`nw-card-meta ${textCn('rs-text-3', { hardness: 'average' })}`}>
                    {card.meta.join(' · ')}
                </div>
            )}
            {card.tags.length > 0 && (
                <div className="nw-card-tags">
                    {card.tags.map((tag) => (
                        <Tag key={tag} size="s" {...tagPreset}>
                            {tag}
                        </Tag>
                    ))}
                </div>
            )}
        </>
    );

    return card.href ? (
        <a className={className} href={card.href} data-row-id={card.id} {...linkProps(card)}>
            {content}
        </a>
    ) : (
        <div className={className} data-row-id={card.id}>
            {content}
        </div>
    );
}

function Logo({ card }: { card: GalleryCard }) {
    if (!card.image) return null;
    const image = <img src={card.image.src} alt={card.image.alt} />;
    return card.href ? (
        <a className="nw-logo" href={card.href} data-row-id={card.id} {...linkProps(card)}>
            {image}
        </a>
    ) : (
        <span className="nw-logo" data-row-id={card.id}>
            {image}
        </span>
    );
}

function View({ view, hidden }: { view: GalleryView; hidden: boolean }) {
    if (view.layout === 'logos') {
        return (
            <div
                className={`nw-gallery-view nw-gallery-logos nw-gallery-${view.size}`}
                data-view-id={view.id}
                hidden={hidden}
            >
                {view.cards.map((card) => (
                    <Logo key={card.id} card={card} />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`nw-gallery-view nw-gallery-cards nw-gallery-${view.size}`}
            data-view-id={view.id}
            hidden={hidden}
            style={{ gridTemplateColumns: `repeat(${view.columns}, minmax(0, 1fr))` }}
        >
            {view.cards.map((card) => (
                <Card key={card.id} card={card} view={view} />
            ))}
        </div>
    );
}

export function Gallery({ node }: { node: GalleryNode }) {
    const [active, setActive] = useState<string>(node.views[0]?.id ?? '');

    return (
        <div id={`b-${node.id}`} className="nw-gallery">
            {node.views.length > 1 && (
                <Switcher<string>
                    className="nw-gallery-tabs"
                    value={active}
                    onChange={setActive}
                    options={node.views.map((view) => ({ value: view.id, label: view.name || 'Untitled' }))}
                />
            )}
            {node.views.map((view) => (
                <View key={view.id} view={view} hidden={view.id !== active} />
            ))}
        </div>
    );
}
