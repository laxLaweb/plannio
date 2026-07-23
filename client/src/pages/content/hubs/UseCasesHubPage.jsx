import { HUB_ROUTES, USE_CASE_ROUTES } from "../../../../../shared/content-routes.mjs";
import { ContentHubPage } from "../ContentHubPage";

const hub = HUB_ROUTES.find((r) => r.path === "/use-cases");

export function UseCasesHubPage() {
  const links = USE_CASE_ROUTES.map((route) => ({
    path: route.path,
    title: route.hubTitle,
    desc: route.hubDesc,
  }));

  return (
    <ContentHubPage
      title={hub.pageTitle}
      description={hub.pageDescription}
      path={hub.path}
      links={links}
    />
  );
}
