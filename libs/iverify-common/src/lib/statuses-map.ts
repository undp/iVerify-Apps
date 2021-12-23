import { Injectable } from "@nestjs/common";
import { TasksLabels } from "./tasks-labels";

const lan = process.env.language;

    export const StatusesMap = [
        {label: TasksLabels[lan].status_unstarted, value: process.env.UNSTARTED_VALUE, resolution: false, default: true},
        {label: TasksLabels[lan].status_in_progress, value: process.env.IN_PROGRESS_VALUE, resolution: false, default: false},
        {label: TasksLabels[lan].status_false, value: process.env.FALSE_VALUE, resolution: true, default: false},
        {label: TasksLabels[lan].status_true, value: process.env.TRUE_VALUE, resolution: true, default: false},
        {label: TasksLabels[lan].status_misleading, value: process.env.MISLEADING_VALUE, resolution: true, default: false},
        {label: TasksLabels[lan].status_out_of_scope, value: process.env.OUT_OF_SCOPE, resolution: true, default: false},
        {label: TasksLabels[lan].status_partly_false, value: process.env.PARTLY_FALSE_VALUE, resolution: true, default: false},
        {label: TasksLabels[lan].status_inconclusive, value: process.env.INCONCLUSIVE_VALUE, resolution: true, default: false},
        {label: TasksLabels[lan].status_pre_checked, value: process.env.PRE_CHECKED_VALUE, resolution: false, default: false}
    ]
