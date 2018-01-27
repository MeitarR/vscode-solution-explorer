import { TreeItem, TreeItemCollapsibleState } from "../index";
import { TreeItemContext } from "../TreeItemContext";
import { ContextValues } from "../ContextValues";
import { ProjectInSolution } from "../../model/Solutions";
import { Project, ProjectReference } from "../../model/Projects";
import { ProjectReferencedProjectTreeItem } from "./ProjectReferencedProjectTreeItem";

export class ProjectReferencedProjectsTreeItem extends TreeItem {
    constructor(context: TreeItemContext, private readonly project: Project, contextValue?: string) {
        super(context, "projects", TreeItemCollapsibleState.Collapsed, ContextValues.ProjectReferencedProjects + (contextValue ? '-' + contextValue : ''), project.fullPath);
    }

    protected async createChildren(childContext: TreeItemContext): Promise<TreeItem[]> {  
        var refs = await this.getProjectReferences();

        let result: TreeItem[] = [];
        refs.forEach(ref => {
            result.push(this.createProjectReferenceItem(childContext, ref));
        });

        return result;
    }

    private async getProjectReferences(): Promise<ProjectReference[]> {
        var refs = await this.project.getProjectReferences();
        refs.sort((a, b) => {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });

        return refs;
    }

    protected createProjectReferenceItem(childContext: TreeItemContext, ref: ProjectReference) {
        return new ProjectReferencedProjectTreeItem(childContext, ref);
    }
}