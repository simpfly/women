/**
 * 纯前端访问人次与完成轮次统计服务 (Stats Tracker)
 * 遵循 KISS 原则：无须外部服务器，结合本地真实答题持久化与时间模型平滑推算全网轮次。
 */

const STORAGE_KEYS = {
  LOCAL_COMPLETED_ROUNDS: 'f_allergen_local_completed_rounds',
  LOCAL_VISIT_COUNT: 'f_allergen_local_visits',
  SESSION_ACTIVE: 'f_allergen_session_active'
};

// 项目基准锚点配置
const BASE_TIMESTAMP = 1735689600000; // 2025-01-01 00:00:00 UTC
const BASE_TEST_ROUNDS = 38240;       // 基础累计测试完成轮次
const BASE_VISITOR_COUNT = 128450;    // 基础观察者访问人次

export interface PlatformStats {
  totalTestRounds: number;      // 累计完成的测试轮次
  visitorCount: number;         // 累计链接的观察者人次
  localCompletedRounds: number; // 本地当前设备完成的轮次
}

class StatsTracker {
  /**
   * 记录并计算当前会话访问
   */
  recordVisit(): void {
    try {
      const isSessionActive = sessionStorage.getItem(STORAGE_KEYS.SESSION_ACTIVE);
      if (!isSessionActive) {
        sessionStorage.setItem(STORAGE_KEYS.SESSION_ACTIVE, 'true');
        const visits = parseInt(localStorage.getItem(STORAGE_KEYS.LOCAL_VISIT_COUNT) || '0', 10);
        localStorage.setItem(STORAGE_KEYS.LOCAL_VISIT_COUNT, (visits + 1).toString());
      }
    } catch {
      // 兼容某些禁用 storage 的极端环境
    }
  }

  /**
   * 获取本地设备实际完成的测试轮次
   */
  getLocalCompletedRounds(): number {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.LOCAL_COMPLETED_ROUNDS) || '0', 10);
    } catch {
      return 0;
    }
  }

  /**
   * 用户完成一次筛查并生成报告时调用：原子递增本地完成数
   */
  incrementCompletedRounds(): number {
    try {
      const current = this.getLocalCompletedRounds();
      const updated = current + 1;
      localStorage.setItem(STORAGE_KEYS.LOCAL_COMPLETED_ROUNDS, updated.toString());
      return this.getStats().totalTestRounds;
    } catch {
      return this.getStats().totalTestRounds;
    }
  }

  /**
   * 获取当前全网及本地统计数据
   */
  getStats(): PlatformStats {
    const now = Date.now();
    const elapsedMs = Math.max(0, now - BASE_TIMESTAMP);

    // 时间模型：
    // 每 15 分钟（900,000 ms）平均完成 1 轮测试
    // 每 5 分钟（300,000 ms）平均链接 1 位观察者
    const roundsFromTime = Math.floor(elapsedMs / 900000);
    const visitorsFromTime = Math.floor(elapsedMs / 300000);

    const localCompleted = this.getLocalCompletedRounds();

    return {
      totalTestRounds: BASE_TEST_ROUNDS + roundsFromTime + localCompleted,
      visitorCount: BASE_VISITOR_COUNT + visitorsFromTime,
      localCompletedRounds: localCompleted
    };
  }
}

export const statsTracker = new StatsTracker();
