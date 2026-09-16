import access from '@/access';
import { getGroupLabel, getPermissionLabel } from '@/constants/permissionLabel';
import {
  getRoleToCustomPermission,
  permissions as queryPermissionGroups,
  updateRole,
} from '@/services/nenkin/role';
import { getErrorCode } from '@/utils/error';
import { ArrowLeftOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useModel, useSearchParams } from '@umijs/max';
import { Button, Card, Checkbox, Empty, Menu, message, Space, Spin, Tag, Tooltip } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './index.less';

const PermissionAssignPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { initialState } = useModel('@@initialState');
  const checkAccess = access(initialState);
  const currentUser = initialState?.currentUser;

  const roleIdFromQuery = searchParams.get('roleId');
  const selectedRoleId = useMemo(() => {
    if (!roleIdFromQuery) return undefined;
    const n = Number(roleIdFromQuery);
    return Number.isFinite(n) ? n : undefined;
  }, [roleIdFromQuery]);

  const [groups, setGroups] = useState<API.PermissionGroup>({});
  const [role, setRole] = useState<API.RoleToCustomPermission | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /** Quyen cua chinh nguoi dang thao tac: khong cap duoc quyen minh khong co. */
  const userPerms = currentUser?.permissions ?? [];
  const hasAllPermission = useMemo(() => userPerms.includes('all'), [userPerms]);
  const userPermSet = useMemo(() => new Set(userPerms), [userPerms]);

  /** Gioi han tu role cha cua role dang sua. */
  const parentPermissions = role?.permissionParent;
  const hasParentAll = useMemo(
    () => Array.isArray(parentPermissions) && parentPermissions.includes('all'),
    [parentPermissions],
  );
  const hasParentLimit = useMemo(
    () => Array.isArray(parentPermissions) && !hasParentAll,
    [parentPermissions, hasParentAll],
  );
  const parentPermSet = useMemo(() => new Set(parentPermissions ?? []), [parentPermissions]);

  const allPermissionKeys = useMemo(
    () => Object.values(groups).reduce((acc: string[], p) => acc.concat(p), []),
    [groups],
  );

  const fetchData = useCallback(async () => {
    if (!selectedRoleId) {
      history.push('/users/role');
      return;
    }
    setLoading(true);
    try {
      const [groupRes, roleRes] = await Promise.all([
        queryPermissionGroups(),
        getRoleToCustomPermission(selectedRoleId),
      ]);
      if (!roleRes?.id) {
        message.error('Không tải được dữ liệu quyền.');
        history.push('/users/role');
        return;
      }
      setGroups(groupRes || {});
      setRole(roleRes);
    } catch (e) {
      message.error('Không tải được dữ liệu quyền.');
      history.push('/users/role');
    } finally {
      setLoading(false);
    }
  }, [selectedRoleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const keys = Object.keys(groups);
    if (keys.length > 0 && !activeGroupKey) {
      setActiveGroupKey(keys[0]);
    }
  }, [groups, activeGroupKey]);

  // Dung permission cua role hien tai. 'all' duoc bung ra thanh tung permission.
  useEffect(() => {
    if (!role || allPermissionKeys.length === 0) return;
    const rolePerms = role.permissions?.includes('all')
      ? allPermissionKeys
      : role.permissions ?? [];
    setCheckedKeys(
      new Set(hasParentLimit ? rolePerms.filter((p) => parentPermSet.has(p)) : rolePerms),
    );
  }, [role, allPermissionKeys, hasParentLimit, parentPermSet]);

  /** Chi cho tich permission ma nguoi dang thao tac co VA role cha cho phep. */
  const canEditPermission = useCallback(
    (key: string) => {
      if (hasParentLimit && !parentPermSet.has(key)) return false;
      return hasAllPermission || userPermSet.has(key);
    },
    [hasAllPermission, userPermSet, hasParentLimit, parentPermSet],
  );

  const currentGroupKeys = useMemo(
    () => (activeGroupKey ? groups[activeGroupKey] ?? [] : []),
    [groups, activeGroupKey],
  );

  const editableKeysInGroup = useMemo(
    () => currentGroupKeys.filter(canEditPermission),
    [currentGroupKeys, canEditPermission],
  );

  const isGroupAllChecked =
    editableKeysInGroup.length > 0 && editableKeysInGroup.every((p) => checkedKeys.has(p));
  const isGroupIndeterminate =
    editableKeysInGroup.some((p) => checkedKeys.has(p)) && !isGroupAllChecked;

  const togglePermission = (key: string) => {
    if (!canEditPermission(key)) return;
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleGroupAll = (checked: boolean) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      editableKeysInGroup.forEach((p) => {
        if (checked) next.add(p);
        else next.delete(p);
      });
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedRoleId || !role) return;
    setSaving(true);
    const hide = message.loading('Đang lưu...');
    try {
      const perms = Array.from(checkedKeys).filter(canEditPermission);
      await updateRole(selectedRoleId, {
        name: role.name,
        slug: role.slug,
        permissions: perms,
      });
      hide();
      message.success('Đã cập nhật phân quyền.');
      await fetchData();
    } catch (error) {
      hide();
      const code = getErrorCode(error);
      message.error(code === 'ROLE_NOT_FOUND' ? 'Không tìm thấy quyền.' : 'Cập nhật bị lỗi.');
    } finally {
      setSaving(false);
    }
  };

  if (!checkAccess.updateRolePermissions) {
    return (
      <PageContainer>
        <Empty description="Bạn không có quyền phân quyền." />
      </PageContainer>
    );
  }

  const groupKeys = Object.keys(groups);

  return (
    <PageContainer
      title={
        <Space size="middle">
          <SafetyCertificateOutlined style={{ fontSize: 22, color: '#1677ff' }} />
          <span>Phân quyền chi tiết</span>
          {role?.name && <Tag color="blue">{role.name}</Tag>}
        </Space>
      }
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/users/role')}>
            Quay lại danh sách
          </Button>
          <Button type="primary" loading={saving} onClick={handleSave}>
            Lưu phân quyền
          </Button>
        </Space>
      }
    >
      {hasParentLimit && (
        <Card size="small" style={{ marginBottom: 16 }}>
          Quyền này bị giới hạn bởi quyền cha — các permission ngoài phạm vi của quyền cha sẽ bị
          khoá.
        </Card>
      )}

      <Spin spinning={loading}>
        <div className="permission-assign-layout">
          <aside className="permission-assign-sidebar">
            <div className="permission-assign-sidebar-subtitle">Nhóm quyền</div>
            <Menu
              mode="inline"
              selectedKeys={activeGroupKey ? [activeGroupKey] : []}
              onClick={({ key }) => setActiveGroupKey(key)}
              items={groupKeys.map((k) => ({ key: k, label: getGroupLabel(k) }))}
            />
          </aside>

          <section className="permission-assign-content">
            {!activeGroupKey && !loading && <Empty description="Chưa có nhóm quyền nào." />}

            {activeGroupKey && (
              <Card
                title={getGroupLabel(activeGroupKey)}
                extra={
                  <Checkbox
                    checked={isGroupAllChecked}
                    indeterminate={isGroupIndeterminate}
                    disabled={editableKeysInGroup.length === 0}
                    onChange={(e) => toggleGroupAll(e.target.checked)}
                  >
                    Chọn tất cả
                  </Checkbox>
                }
              >
                <div className="permission-assign-grid">
                  {currentGroupKeys.map((p) => {
                    const editable = canEditPermission(p);
                    const checkbox = (
                      <Checkbox
                        checked={checkedKeys.has(p)}
                        disabled={!editable}
                        onChange={() => togglePermission(p)}
                      >
                        {getPermissionLabel(p)}
                      </Checkbox>
                    );
                    return (
                      <div key={p} className="permission-assign-item">
                        {editable ? (
                          checkbox
                        ) : (
                          <Tooltip title="Bạn không có quyền này hoặc quyền cha không cho phép">
                            {checkbox}
                          </Tooltip>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </section>
        </div>
      </Spin>
    </PageContainer>
  );
};

export default PermissionAssignPage;
