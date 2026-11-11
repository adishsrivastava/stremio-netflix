// Copyright (C) 2017-2026 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, Image } = require('stremio/components');
const { default: getMetaDetailsHref } = require('stremio/common/getMetaDetailsHref');
const styles = require('./styles');

const QUALITY_BADGE = 'HD';

const BoardHero = ({ className, metaItem }) => {
    const { t } = useTranslation();
    const moreInfoLabel = React.useMemo(() => (
        String(t('MORE_INFO', { defaultValue: 'More Info' })).replace(/\s*(?:\.{3}|…)$/, '')
    ), [t]);
    const name = typeof metaItem?.name === 'string' ? metaItem.name : '';
    const logo = typeof metaItem?.logo === 'string' && metaItem.logo.length > 0 ? metaItem.logo : null;
    const background = typeof metaItem?.background === 'string' && metaItem.background.length > 0 ? metaItem.background : null;
    const description = typeof metaItem?.description === 'string' ? metaItem.description : '';
    const releaseInfo = typeof metaItem?.releaseInfo === 'string' && metaItem.releaseInfo.length > 0 ?
        metaItem.releaseInfo
        :
        (typeof metaItem?.year === 'string' ? metaItem.year : null);
    const runtime = typeof metaItem?.runtime === 'string' && metaItem.runtime.length > 0 ? metaItem.runtime : null;
    const genres = React.useMemo(() => {
        if (Array.isArray(metaItem?.genres)) {
            return metaItem.genres.filter((genre) => typeof genre === 'string').slice(0, 3);
        }

        if (Array.isArray(metaItem?.genre)) {
            return metaItem.genre.filter((genre) => typeof genre === 'string').slice(0, 3);
        }

        return [];
    }, [metaItem]);
    const rating = typeof metaItem?.imdbRating === 'string' && metaItem.imdbRating.length > 0 ? metaItem.imdbRating : null;
    const playHref = React.useMemo(() => {
        if (typeof metaItem?.deepLinks?.player === 'string') {
            return metaItem.deepLinks.player;
        }

        return getMetaDetailsHref(metaItem?.deepLinks);
    }, [metaItem]);
    const moreHref = React.useMemo(() => getMetaDetailsHref(metaItem?.deepLinks, true), [metaItem]);
    const renderLogoFallback = React.useCallback(() => (
        <h1 className={styles['title']}>{name}</h1>
    ), [name]);
    const heroStyle = React.useMemo(() => (
        background ? { '--hero-background-image': `url("${background}")` } : {}
    ), [background]);

    if (!metaItem || name.length === 0) {
        return null;
    }

    return (
        <section
            className={classnames(className, styles['board-hero'], 'animation-fade-in')}
            style={heroStyle}
            aria-label={name}
        >
            <div className={styles['backdrop']} />
            <div className={styles['vignette']} />
            <div className={styles['eyebrow']}>
                <span className={styles['brand-badge']}>S</span>
                <span>{t('FEATURED', { defaultValue: 'Featured' })} {metaItem.type === 'series' ? t('SERIES', { defaultValue: 'Series' }) : t('FILM', { defaultValue: 'Film' })}</span>
            </div>
            <div className={styles['content']}>
                {
                    logo ?
                        <Image
                            className={styles['logo']}
                            src={logo}
                            alt={name}
                            renderFallback={renderLogoFallback}
                        />
                        :
                        renderLogoFallback()
                }
                <div className={styles['metadata']}>
                    {
                        rating !== null ?
                            <span className={styles['match']}>{`IMDb ${rating}`}</span>
                            :
                            null
                    }
                    {
                        releaseInfo !== null ?
                            <span>{releaseInfo}</span>
                            :
                            null
                    }
                    {
                        runtime !== null ?
                            <span>{runtime}</span>
                            :
                            null
                    }
                    <span className={styles['quality']}>{QUALITY_BADGE}</span>
                </div>
                {
                    description.length > 0 ?
                        <p className={styles['description']}>{description}</p>
                        :
                        null
                }
                {
                    genres.length > 0 ?
                        <div className={styles['genres']}>
                            {genres.map((genre, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 ? <span className={styles['genre-divider']}>•</span> : null}
                                    <span>{genre}</span>
                                </React.Fragment>
                            ))}
                        </div>
                        :
                        null
                }
                <div className={styles['actions']}>
                    {
                        typeof playHref === 'string' && playHref.length > 0 ?
                            <Button className={classnames(styles['action-button'], styles['play-button'])} href={playHref} tabIndex={-1}>
                                <Icon className={styles['action-icon']} name={'play'} />
                                <span className={styles['action-label']}>{t('PLAY', { defaultValue: 'Play' })}</span>
                            </Button>
                            :
                            null
                    }
                    {
                        typeof moreHref === 'string' && moreHref.length > 0 ?
                            <Button className={classnames(styles['action-button'], styles['info-button'])} href={moreHref} tabIndex={-1}>
                                <Icon className={styles['action-icon']} name={'about'} />
                                <span className={styles['action-label']}>{moreInfoLabel}</span>
                            </Button>
                            :
                            null
                    }
                </div>
            </div>
        </section>
    );
};

BoardHero.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        logo: PropTypes.string,
        background: PropTypes.string,
        description: PropTypes.string,
        releaseInfo: PropTypes.string,
        year: PropTypes.string,
        runtime: PropTypes.string,
        imdbRating: PropTypes.string,
        genres: PropTypes.arrayOf(PropTypes.string),
        genre: PropTypes.arrayOf(PropTypes.string),
        deepLinks: PropTypes.shape({
            player: PropTypes.string,
            metaDetailsVideos: PropTypes.string,
            metaDetailsStreams: PropTypes.string,
        }),
    }),
};

module.exports = BoardHero;
