import { ConfigModel } from '.stackbit/models/Config';
import { ThemeStyleModel } from '.stackbit/models/ThemeStyle';
import {
    Config,
    ContentObject,
    ContentObjectType,
    GlobalProps,
    PageComponentProps,
    PostFeedLayout,
    PostLayout,
    ProjectFeedLayout,
    ProjectLayout,
    RecentPostsSection,
    RecentProjectsSection,
    ThemeStyle
} from '@/types';
import { deepMapObject } from './data-utils';

export function resolveStaticProps(urlPath: string, allData: ContentObject[]): PageComponentProps {
    const originalPage = allData.find((obj) => obj.__metadata.urlPath === urlPath);
    const globalProps: GlobalProps = {
        site: allData.find((obj) => obj.__metadata.modelName === ConfigModel.name) as Config || null,
        theme: allData.find((obj) => obj.__metadata.modelName === ThemeStyleModel.name) as ThemeStyle || null
    };

    function enrichContent(value: any) {
        const type = value?.__metadata?.modelName;
        if (type && PropsResolvers[type]) {
            const resolver = PropsResolvers[type];
            return resolver(value, allData);
        } else {
            return value;
        }
    }

    const enrichedPage = deepMapObject(originalPage, enrichContent) as ContentObject;
    return {
        ...enrichedPage,
        global: globalProps
    };
}

type ResolverFunction = (props: ContentObject, allData: ContentObject[]) => ContentObject;

const PropsResolvers: Partial<Record<ContentObjectType, ResolverFunction>> = {
    PostFeedLayout: (props, allData) => {
        const allPosts = getAllPostsSorted(allData);
        return {
            ...(props as PostFeedLayout),
            items: allPosts
        };
    },
    RecentPostsSection: (props, allData) => {
        const recentPosts = getAllPostsSorted(allData).slice(0, (props as RecentPostsSection).recentCount || 3);
        return {
            ...props,
            posts: recentPosts
        };
    },
    ProjectLayout: (props, allData) => {
        const allProjects = getAllProjectsSorted(allData);
        const currentProjectId = props.__metadata?.id;
        const currentProjectIndex = allProjects.findIndex((project) => project.__metadata?.id === currentProjectId);
        const nextProject = currentProjectIndex > 0 ? allProjects[currentProjectIndex - 1] : null;
        const prevProject = currentProjectIndex < allProjects.length - 1 ? allProjects[currentProjectIndex + 1] : null;
        return {
            ...props,
            prevProject,
            nextProject
        };
    },
    ProjectFeedLayout: (props, allData) => {
        const allProjects = getAllProjectsSorted(allData);
        return {
            ...(props as ProjectFeedLayout),
            items: allProjects
        };
    },
    RecentProjectsSection: (props, allData) => {
        const recentProjects = getAllProjectsSorted(allData).slice(
            0,
            (props as RecentProjectsSection).recentCount || 3
        );
        return {
            ...props,
            projects: recentProjects
        };
    },
    FeaturedProjectsSection: (props, allData) => {
        const projects = Array.isArray(props.projects)
            ? props.projects.map((projRef: any) => {
                if (typeof projRef === 'string') {
                    return allData.find(
                        (obj) =>
                            obj.__metadata &&
                            obj.__metadata.sourceFilePath &&
                            obj.__metadata.sourceFilePath.replace(/\\/g, '/') === projRef.replace(/\\/g, '/')
                    ) || null;
                }
                return projRef;
            }).filter(Boolean)
            : [];
        return {
            ...props,
            projects
        };
    },
    PostFeedSection: (props, allData) => {
        const posts = Array.isArray(props.posts)
            ? props.posts.map((postRef: any) => {
                if (typeof postRef === 'string') {
                    return allData.find(
                        (obj) =>
                            obj.__metadata &&
                            obj.__metadata.sourceFilePath &&
                            obj.__metadata.sourceFilePath.replace(/\\/g, '/') === postRef.replace(/\\/g, '/')
                    ) || null;
                }
                return postRef;
            }).filter(Boolean)
            : [];
        return {
            ...props,
            posts
        };
    }
};

function getAllPostsSorted(objects: ContentObject[]) {
    const all = objects.filter((object) => object.__metadata?.modelName === 'PostLayout') as PostLayout[];
    const sorted = all.sort((postA, postB) => new Date(postB.date).getTime() - new Date(postA.date).getTime());
    return sorted;
}

function getAllProjectsSorted(objects: ContentObject[]) {
    const all = objects.filter((object) => object.__metadata?.modelName === 'ProjectLayout') as ProjectLayout[];
    const sorted = all.sort(
        (projectA, projectB) => new Date(projectB.date).getTime() - new Date(projectA.date).getTime()
    );
    return sorted;
}
