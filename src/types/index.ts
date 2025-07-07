import { Config, ContentObject, ThemeStyle } from './generated';

export * from './base';

export type {
    Button, Config, ContentObject, ContentObjectMetadata, ContentObjectType, FeaturedPostsSection, FeaturedProjectsSection, Footer, Header, ImageBlock, Link, PageLayout, Person, PostFeedSection, PostLayout, ProjectFeedSection, ProjectLayout, RecentPostsSection, RecentProjectsSection, SectionModels, Testimonial,
    TestimonialsSection,
    TextSection, ThemeStyle
} from './generated';

export type GlobalProps = {
    site: Config;
    theme: ThemeStyle;
};

export type PageComponentProps = ContentObject & {
    global: GlobalProps;
};
