import React from "react";
import { connect, ConnectedProps } from "react-redux";
import useAuth0 from "ui/utils/useAuth0";
import * as selectors from "ui/reducers/app";
import { UIState } from "ui/state";
import { Workspace } from "ui/types";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import MaterialIcon from "ui/components/shared/MaterialIcon";
import { Redacted } from "ui/components/Redacted";

type WorkspaceDropdownButtonProps = PropsFromRedux & {
  workspaces: (Workspace | { id: null; name: string; members: never[] })[];
};

function WorkspaceDropdownButton({ workspaces, currentWorkspaceId }: WorkspaceDropdownButtonProps) {
  const { user } = useAuth0();
  let picture, title, subtitle;

  // Just render the component if we're in the default personal state to avoid flickering.
  if (!workspaces) {
    return null;
  }

  if (currentWorkspaceId == null) {
    picture = <img src={user.picture} />;
    title = "Your Library";
    subtitle = user.email;
  } else {
    const displayedWorkspace = workspaces.find(workspace => workspace.id == currentWorkspaceId);
    picture = <MaterialIcon>workspaces</MaterialIcon>;
    title = displayedWorkspace!.name;
    const count = displayedWorkspace?.members?.length || 0;
    subtitle = `Workspace - ${count} member${count == 1 ? "" : "s"}`;
  }

  return (
    <Menu.Button className="inline-flex items-center justify-center w-full rounded-md px-0 mx-1.5 py-1.5 text-lg font-medium  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-primaryAccent inter">
      <Redacted>{title}</Redacted>
      <ChevronDownIcon className="-mr-1 ml-1.5 h-5 w-5" aria-hidden="true" />
    </Menu.Button>
  );
}

const connector = connect((state: UIState) => ({
  currentWorkspaceId: selectors.getWorkspaceId(state),
}));
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(WorkspaceDropdownButton);
