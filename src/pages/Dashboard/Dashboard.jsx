import React, { useState } from "react";
import styles from "./Dashboard.module.scss";
import GlassCard from "../../components/GlassCard/GlassCard";
import useAuth from "../../hooks/useAuth";
import {
  PersonRemove,
  Group,
  Warning,
  LocationCity,
  Gavel,
  Description,
  Schedule,
  Search,
  AddCircle,
  CloudUpload,
  PictureAsPdf,
  GridOn,
  Notifications,
  TrendingUp,
  PieChart,
  BarChart,
  Flag,
  Timeline,
  Map,
  Chat,
  Security,
  Assessment,
  History,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = ({
  allBlacklistEntries,
  allEmployees,
  currentSubsidiary,
}) => {
  const { userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Filter data based on subsidiary for Admins
  const filteredBlacklist =
    userRole === "super_admin"
      ? allBlacklistEntries
      : allBlacklistEntries.filter(
          (entry) => entry.subsidiary.toLowerCase() === currentSubsidiary
        );

  const filteredEmployees =
    userRole === "super_admin"
      ? allEmployees
      : allEmployees.filter(
          (emp) => emp.subsidiary.toLowerCase() === currentSubsidiary
        );

  // Enhanced stats calculations
  const activeBlacklistCount = filteredBlacklist.filter(
    (entry) => entry.status === "Active"
  ).length;

  const underReviewCount = filteredBlacklist.filter(
    (entry) => entry.status === "Under Review"
  ).length;

  const expiringSoonCount = filteredBlacklist.filter((entry) => {
    const expiryDate = new Date(entry.expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.setDate(today.getDate() + 30));
    return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
  }).length;

  const documentedCasesCount = filteredBlacklist.filter(
    (entry) => entry.documentationComplete
  ).length;

  const documentationCompliance =
    filteredBlacklist.length > 0
      ? Math.round((documentedCasesCount / filteredBlacklist.length) * 100)
      : 0;

  const totalEmployeesCount = filteredEmployees.length;
  const totalBlacklistCount = filteredBlacklist.length;

  // Trend data for charts
  const monthlyTrendData = [
    { name: "Jan", cases: 12 },
    { name: "Feb", cases: 19 },
    { name: "Mar", cases: 15 },
    { name: "Apr", cases: 8 },
    { name: "May", cases: 11 },
    { name: "Jun", cases: 18 },
    { name: "Jul", cases: 14 },
    { name: "Aug", cases: 22 },
    { name: "Sep", cases: 19 },
    { name: "Oct", cases: 13 },
    { name: "Nov", cases: 15 },
    { name: "Dec", cases: 10 },
  ];

  const departmentData = [
    { name: "Operations", value: 35 },
    { name: "Finance", value: 25 },
    { name: "HR", value: 15 },
    { name: "IT", value: 10 },
    { name: "Marketing", value: 15 },
  ];

  const reasonData = [
    { name: "Abscondment", value: 40 },
    { name: "Fraud", value: 25 },
    { name: "Harassment", value: 15 },
    { name: "Theft", value: 12 },
    { name: "Policy Violation", value: 8 },
  ];

  const COLORS = ["#FF3B3F", "#FF9500", "#FFCC00", "#4CD964", "#5AC8FA"];

  // Recent alerts
  const recentAlerts = [
    {
      type: "new",
      message: "New case added today: Farai Makoni",
      date: new Date(),
    },
    {
      type: "deadline",
      message: "Review deadline approaching for case #245",
      daysLeft: 3,
    },
    {
      type: "document",
      message: "Case #189 missing required documents",
      caseId: 189,
    },
    {
      type: "rehire",
      message: "Attempted rehire detected for blacklisted person",
      name: "Sarah Smith",
    },
  ];

  // Featured cases
  const featuredCases =
    filteredBlacklist.length > 0
      ? [
          filteredBlacklist[0],
          ...filteredBlacklist.slice(1).filter((c) => c.riskLevel === "high"),
        ].slice(0, 3)
      : [];

  // Subsidiary stats for Super Admins
  const subsidiaryStats = {};
  if (userRole === "super_admin") {
    allBlacklistEntries.forEach((entry) => {
      if (!subsidiaryStats[entry.subsidiary]) {
        subsidiaryStats[entry.subsidiary] = {
          activeBlacklist: 0,
          totalBlacklist: 0,
        };
      }
      if (entry.status === "Active") {
        subsidiaryStats[entry.subsidiary].activeBlacklist++;
      }
      subsidiaryStats[entry.subsidiary].totalBlacklist++;
    });
  }

  return (
    <div className={styles.dashboard}>
      {/* Search and Quick Actions Bar */}
      <div className={styles.searchActionsBar}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search cases by name, ID, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.quickActions}>
          {userRole !== "viewer" && (
            <>
              <button className={styles.actionButton}>
                <AddCircle /> Blacklist Now
              </button>
              <button className={styles.actionButton}>
                <CloudUpload /> Bulk Import
              </button>
            </>
          )}
          <button className={styles.actionButton}>
            <PictureAsPdf /> Generate Report
          </button>
          <button className={styles.actionButton}>
            <GridOn /> Export Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "overview" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "trends" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("trends")}
        >
          Trends & Analytics
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "compliance" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("compliance")}
        >
          Compliance
        </button>
      </div>

      {/* Main Dashboard Content */}
      {activeTab === "overview" && (
        <>
          {/* Top-Level Status Cards */}
          <div className={styles.statsGrid}>
            <GlassCard className={`${styles.statCard} ${styles.critical}`}>
              <PersonRemove className={styles.statIcon} />
              <h3 className={styles.statValue}>{activeBlacklistCount}</h3>
              <p className={styles.statLabel}>Active Blacklisted</p>
              <div className={styles.statTrend}>
                <TrendingUp /> +2% from last month
              </div>
            </GlassCard>

            <GlassCard className={`${styles.statCard} ${styles.warning}`}>
              <Gavel className={styles.statIcon} />
              <h3 className={styles.statValue}>{underReviewCount}</h3>
              <p className={styles.statLabel}>Under Review</p>
              <div className={styles.statTrend}>
                <Schedule /> 5 awaiting HR approval
              </div>
            </GlassCard>

            <GlassCard className={`${styles.statCard} ${styles.alert}`}>
              <Description className={styles.statIcon} />
              <h3 className={styles.statValue}>{expiringSoonCount}</h3>
              <p className={styles.statLabel}>Expiring Soon</p>
              <div className={styles.statTrend}>
                <Warning /> Review needed
              </div>
            </GlassCard>

            <GlassCard className={`${styles.statCard} ${styles.success}`}>
              <Assessment className={styles.statIcon} />
              <h3 className={styles.statValue}>{documentationCompliance}%</h3>
              <p className={styles.statLabel}>Documentation Compliance</p>
              <div className={styles.statTrend}>
                {documentationCompliance > 90
                  ? "Excellent"
                  : "Needs improvement"}
              </div>
            </GlassCard>
          </div>

          {/* Alerts Section */}
          <h3 className={styles.sectionTitle}>
            <Notifications className={styles.sectionIcon} /> Recent Alerts
          </h3>
          <div className={styles.alertsGrid}>
            {recentAlerts.map((alert, index) => (
              <GlassCard
                key={index}
                className={`${styles.alertCard} ${styles[alert.type]}`}
              >
                <div className={styles.alertHeader}>
                  {alert.type === "new" && (
                    <Flag className={styles.alertIcon} />
                  )}
                  {alert.type === "deadline" && (
                    <Schedule className={styles.alertIcon} />
                  )}
                  {alert.type === "document" && (
                    <Description className={styles.alertIcon} />
                  )}
                  {alert.type === "rehire" && (
                    <Security className={styles.alertIcon} />
                  )}
                  <span className={styles.alertTitle}>
                    {alert.type === "new" && "New Case"}
                    {alert.type === "deadline" && "Deadline Approaching"}
                    {alert.type === "document" && "Missing Documents"}
                    {alert.type === "rehire" && "Rehire Attempt"}
                  </span>
                </div>
                <p className={styles.alertMessage}>{alert.message}</p>
                <div className={styles.alertFooter}>
                  <span className={styles.alertDate}>
                    {alert.date?.toLocaleDateString()}
                    {alert.daysLeft && `${alert.daysLeft} days left`}
                  </span>
                  <button className={styles.alertAction}>View</button>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Case Spotlight */}
          {featuredCases.length > 0 && (
            <>
              <h3 className={styles.sectionTitle}>
                <Flag className={styles.sectionIcon} /> Case Spotlight
              </h3>
              <div className={styles.spotlightGrid}>
                {featuredCases.map((caseItem) => (
                  <GlassCard key={caseItem.id} className={styles.spotlightCard}>
                    <div className={styles.spotlightHeader}>
                      <div className={styles.spotlightImage}>
                        {caseItem.employeeName.charAt(0)}
                      </div>
                      <div className={styles.spotlightTitle}>
                        <h4>{caseItem.employeeName}</h4>
                        <span
                          className={`${styles.riskBadge} ${
                            styles[caseItem.riskLevel || "medium"]
                          }`}
                        >
                          {caseItem.riskLevel || "Medium"} Risk
                        </span>
                      </div>
                    </div>
                    <div className={styles.spotlightContent}>
                      <p>
                        <strong>Reason:</strong> {caseItem.reason}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(caseItem.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Status:</strong> {caseItem.status}
                      </p>
                    </div>
                    <div className={styles.spotlightFooter}>
                      <button className={styles.spotlightButton}>
                        View Full Case
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </>
          )}

          {/* Recent Activity */}
          <h3 className={styles.sectionTitle}>
            <History className={styles.sectionIcon} /> Recent Blacklist Activity
          </h3>
          <GlassCard className={styles.recentActivity}>
            {filteredBlacklist.slice(0, 5).length > 0 ? (
              <ul className={styles.activityList}>
                {filteredBlacklist.slice(0, 5).map((entry) => (
                  <li key={entry.id} className={styles.activityItem}>
                    <span className={styles.activityName}>
                      {entry.employeeName}
                    </span>
                    <span className={styles.activityReason}>
                      blacklisted for "{entry.reason}"
                    </span>
                    <span className={styles.activityDate}>
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    {userRole === "super_admin" && (
                      <span className={styles.activitySubsidiary}>
                        ({entry.subsidiary})
                      </span>
                    )}
                    <span
                      className={`${styles.activityStatus} ${
                        styles[entry.status.toLowerCase().replace(" ", "-")]
                      }`}
                    >
                      {entry.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noData}>
                No recent blacklist activity for this subsidiary.
              </p>
            )}
          </GlassCard>
        </>
      )}

      {activeTab === "trends" && (
        <div className={styles.analyticsTab}>
          <h3 className={styles.sectionTitle}>
            <TrendingUp className={styles.sectionIcon} /> Blacklisting Trends
          </h3>
          <GlassCard className={styles.chartCard}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cases"
                  stroke="#FF3B3F"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <div className={styles.chartGrid}>
            <GlassCard className={styles.chartCard}>
              <h4 className={styles.chartTitle}>
                <PieChart className={styles.chartIcon} /> Department Breakdown
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard className={styles.chartCard}>
              <h4 className={styles.chartTitle}>
                <BarChart className={styles.chartIcon} /> Top Blacklisting
                Reasons
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart layout="vertical" data={reasonData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF3B3F" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === "compliance" && (
        <div className={styles.complianceTab}>
          <h3 className={styles.sectionTitle}>
            <Security className={styles.sectionIcon} /> Compliance & Risk
            Management
          </h3>

          <div className={styles.complianceGrid}>
            <GlassCard className={styles.complianceCard}>
              <h4 className={styles.complianceTitle}>
                <Gavel className={styles.complianceIcon} /> Legal Compliance
                Status
              </h4>
              <div className={styles.complianceScore}>
                <div className={styles.scoreCircle}>
                  <span>88%</span>
                </div>
                <p>Overall compliance with local labor laws and regulations</p>
              </div>
              <ul className={styles.complianceList}>
                <li className={styles.complianceItem}>
                  <span className={styles.complianceCheck}>✓</span>
                  GDPR Compliance: Complete
                </li>
                <li className={styles.complianceItem}>
                  <span className={styles.complianceCheck}>✓</span>
                  POPIA Compliance: Complete
                </li>
                <li className={styles.complianceItem}>
                  <span className={styles.complianceWarning}>!</span>
                  Local Labor Law: 92% Complete
                </li>
              </ul>
            </GlassCard>

            <GlassCard className={styles.complianceCard}>
              <h4 className={styles.complianceTitle}>
                <Map className={styles.complianceIcon} /> Risk Heat Map
              </h4>
              <div className={styles.heatMap}>
                {/* This would be replaced with an actual map component */}
                <div className={styles.heatMapPlaceholder}>
                  <div className={styles.heatMapKey}>
                    <span className={styles.low}>Low</span>
                    <span className={styles.medium}>Medium</span>
                    <span className={styles.high}>High</span>
                  </div>
                  <div className={styles.heatMapImage}>
                    {/* Placeholder for map visualization */}
                    <p>Visual representation of risk by location/department</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <h4 className={styles.sectionSubtitle}>
            <History className={styles.sectionIcon} /> Audit Log
          </h4>
          <GlassCard className={styles.auditLog}>
            <div className={styles.auditLogHeader}>
              <span className={styles.auditLogColumn}>Timestamp</span>
              <span className={styles.auditLogColumn}>User</span>
              <span className={styles.auditLogColumn}>Action</span>
              <span className={styles.auditLogColumn}>Case ID</span>
            </div>
            <div className={styles.auditLogContent}>
              <div className={styles.auditLogItem}>
                <span className={styles.auditLogColumn}>Today, 10:45 AM</span>
                <span className={styles.auditLogColumn}>
                  admin@omnicontact.biz
                </span>
                <span className={styles.auditLogColumn}>
                  Updated case status
                </span>
                <span className={styles.auditLogColumn}>#245</span>
              </div>
              <div className={styles.auditLogItem}>
                <span className={styles.auditLogColumn}>Today, 09:30 AM</span>
                <span className={styles.auditLogColumn}>
                  hr@omnicontact.biz
                </span>
                <span className={styles.auditLogColumn}>Added new case</span>
                <span className={styles.auditLogColumn}>#312</span>
              </div>
              <div className={styles.auditLogItem}>
                <span className={styles.auditLogColumn}>
                  Yesterday, 4:15 PM
                </span>
                <span className={styles.auditLogColumn}>
                  manager@omnicontact.biz
                </span>
                <span className={styles.auditLogColumn}>
                  Viewed case details
                </span>
                <span className={styles.auditLogColumn}>#189</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Subsidiary Overview for Super Admins */}
      {userRole === "super_admin" && activeTab === "overview" && (
        <>
          <h3 className={styles.sectionTitle}>
            <LocationCity className={styles.sectionIcon} /> Subsidiary Overview
          </h3>
          <div className={styles.subsidiaryStatsGrid}>
            {Object.entries(subsidiaryStats).map(([sub, data]) => (
              <GlassCard key={sub} className={styles.subStatCard}>
                <h4 className={styles.subStatName}>{sub}</h4>
                <p>
                  Active:{" "}
                  <span className={styles.subStatValueRed}>
                    {data.activeBlacklist}
                  </span>
                </p>
                <p>
                  Total:{" "}
                  <span className={styles.subStatValue}>
                    {data.totalBlacklist}
                  </span>
                </p>
                <div className={styles.subStatTrend}>
                  <TrendingUp /> {Math.floor(Math.random() * 10) + 1}% from last
                  quarter
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
