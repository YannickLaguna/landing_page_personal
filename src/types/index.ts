import { Config, ThemeStyle } from './generated';

export * from './base';

export * from './generated';

export type {
    Button, Config, ContentObjectType, FeaturedPostsSection, FeaturedProjectsSection, Footer, Header, ImageBlock, Link, PageLayout, PageModelType, Person, PostFeedSection, PostLayout, ProjectFeedSection, ProjectLayout, RecentPostsSection, RecentProjectsSection, SectionModels, Testimonial,
    TestimonialsSection, TextSection, ThemeStyle
} from './generated';

export type GlobalProps = {
    site: Config;
    theme: ThemeStyle;
};

export type PageComponentProps = ContentObject & { global: GlobalProps };

// Definición del tipo unión ContentObject
import type {
    BackgroundImage, Button, CheckboxFormControl,
    ContactBlock, ContactSection, CtaSection, DividerSection, EmailFormControl, FeaturedItem, FeaturedItemsSection, FeaturedPostsSection, FeaturedProjectsSection, Footer, FormBlock, Header, HeroSection, ImageBlock, Label, LabelsSection, Link, MediaGallerySection, MetaTag, PageLayout, Person, PostFeedLayout, PostFeedSection, PostLayout, ProjectFeedLayout, ProjectFeedSection, ProjectLayout, QuoteSection, RecentPostsSection, RecentProjectsSection, SelectFormControl, Social, Testimonial, TestimonialsSection, TextareaFormControl, TextFormControl, TextSection,
    VideoBlock
} from './generated';

export type ContentObject =
    | BackgroundImage
    | Button
    | CheckboxFormControl
    | Config
    | ContactBlock
    | ContactSection
    | CtaSection
    | DividerSection
    | EmailFormControl
    | FeaturedItem
    | FeaturedItemsSection
    | FeaturedPostsSection
    | FeaturedProjectsSection
    | Footer
    | FormBlock
    | Header
    | HeroSection
    | ImageBlock
    | Label
    | LabelsSection
    | Link
    | MediaGallerySection
    | MetaTag
    | PageLayout
    | Person
    | PostFeedLayout
    | PostFeedSection
    | PostLayout
    | ProjectFeedLayout
    | ProjectFeedSection
    | ProjectLayout
    | QuoteSection
    | RecentPostsSection
    | RecentProjectsSection
    | SelectFormControl
    | Social
    | Testimonial
    | TestimonialsSection
    | TextareaFormControl
    | TextFormControl
    | TextSection
    | ThemeStyle
    | VideoBlock;
