import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkAllocationComponent } from './work-management/work-allocation/work-allocation.component';
import {RawDataExtractComponent} from './raw-data/raw-data-extract/raw-data-extract.component';
import { TabularDataExtractComponent } from './tabular-dashboard/tabular-data-extract/tabular-data-extract.component';
import { SkillManagementComponent } from './user-management/skill-management/skill-management.component';
import { ReallocateCaseComponent } from './manual-reallocation/reallocate-case/reallocate-case.component';
import { InsightDashboardComponent } from './insights-dashboard/insight-dashboard/insight-dashboard.component';
import { PerformanceDashboardComponent } from './business-performance/performance-dashboard/performance-dashboard.component';

const routes: Routes = [
  { path: 'workmanagement', component: WorkAllocationComponent },
  { path: 'workmanagementtest', component: WorkAllocationComponent },
  {path:'rawdata',component:RawDataExtractComponent},
  {path:'tabulardashboard',component:TabularDataExtractComponent},
  {path:'skillmanagement',component:SkillManagementComponent},
  {path:'reallocatcase',component:ReallocateCaseComponent},
  {path:'insightdashboard',component:InsightDashboardComponent},
  {path:'performancedashboard',component:PerformanceDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
